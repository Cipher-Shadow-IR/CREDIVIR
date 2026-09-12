import { useState, useRef, useEffect } from 'react';
import {
  CheckCircle,
  Search,
  Upload,
  XCircle,
  User,
  Loader2,
  Eye,
  Download,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext, StoredCertificate } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Html5Qrcode } from 'html5-qrcode';
import {
  DEFAULT_CONTRACT_ADDRESS,
  Certificate,
  SEPOLIA_RPC_URL
} from '@/lib/blockchain';
import { ethers } from 'ethers';
import { CertificatePreview } from '@/components/admin/CertificatePreview';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useLocation } from 'react-router-dom';

interface VerificationResult {
  isValid: boolean;
  certificate?: Certificate;
  localData?: StoredCertificate;
  verifiedOnBlockchain: boolean;
}

export default function VerifyCertificate() {
  const [searchHash, setSearchHash] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
  const [showCertificatePreview, setShowCertificatePreview] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedIssuer, setCopiedIssuer] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const { getCertificateByHash } = useAppContext();
  const { toast } = useToast();
  const location = useLocation();

  const copyToClipboard = (text: string, type: 'hash' | 'issuer') => {
    navigator.clipboard.writeText(text);
    if (type === 'hash') {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } else {
      setCopiedIssuer(true);
      setTimeout(() => setCopiedIssuer(false), 2000);
    }
    toast({
      title: 'Copied to Clipboard',
      description: `${type === 'hash' ? 'Certificate hash' : 'Issuer address'} copied.`
    });
  };

  const extractHashFromInput = (input: string) => {
    const trimmed = input.trim();

    if (!trimmed) return '';

    if (trimmed.includes('/verify?hash=')) {
      try {
        const url = new URL(trimmed);
        return url.searchParams.get('hash') || trimmed;
      } catch {
        return trimmed;
      }
    }

    return trimmed;
  };

  const verifyCertificate = async (hash: string) => {
    const cleanHash = extractHashFromInput(hash);

    if (!cleanHash) {
      toast({
        title: 'Error',
        description: 'Please enter a certificate hash',
        variant: 'destructive'
      });
      return;
    }

    setIsVerifying(true);

    try {
      const provider = new ethers.providers.JsonRpcProvider(SEPOLIA_RPC_URL);
      const contract = new ethers.Contract(
        DEFAULT_CONTRACT_ADDRESS,
        [
          'function verifyCertificateView(string _certificateHash) public view returns (bool)',
          'function getCertificate(string _certificateHash) public view returns (string certificateNumber, string studentName, string enrollmentNumber, string course, string institution, uint256 issueYear, uint256 issueDate, string ipfsHash, address issuerAddress)'
        ],
        provider
      );

      const isValid = await contract.verifyCertificateView(cleanHash);

      if (isValid) {
        const certData = await contract.getCertificate(cleanHash);

        const certificate: Certificate = {
          certificateNumber: certData.certificateNumber,
          studentName: certData.studentName,
          enrollmentNumber: certData.enrollmentNumber,
          course: certData.course,
          institution: certData.institution,
          issueYear: certData.issueYear.toNumber(),
          issueDate: certData.issueDate.toNumber(),
          certificateHash: cleanHash,
          ipfsHash: certData.ipfsHash,
          issuerAddress: certData.issuerAddress
        };

        const localData = getCertificateByHash(cleanHash);

        setVerificationResult({
          isValid: true,
          certificate,
          localData,
          verifiedOnBlockchain: true
        });

        toast({
          title: '✓ Certificate Verified!',
          description: 'This certificate is authentic and recorded on the blockchain.'
        });
      } else {
        setVerificationResult({
          isValid: false,
          verifiedOnBlockchain: true
        });

        toast({
          title: '✗ Verification Failed',
          description: 'Certificate not found on the blockchain.',
          variant: 'destructive'
        });
      }
    } catch (err: any) {
      console.error('Verification error:', err);

      const localCert = getCertificateByHash(cleanHash);

      if (localCert) {
        setVerificationResult({
          isValid: true,
          localData: localCert,
          verifiedOnBlockchain: false
        });

        toast({
          title: 'Certificate Found (Offline)',
          description:
            'Verified from local records. Connect to Ganache for blockchain verification.'
        });
      } else {
        setVerificationResult({
          isValid: false,
          verifiedOnBlockchain: false
        });

        toast({
          title: 'Verification Failed',
          description: 'Certificate not found. Ensure Ganache is running.',
          variant: 'destructive'
        });
      }
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlHash = params.get('hash');

    if (urlHash) {
      setSearchHash(urlHash);
      verifyCertificate(urlHash);
    }
  }, [location.search]);

  const renderPdfToImage = async (file: File): Promise<File> => {
    const pdfjs = await import('pdfjs-dist');

    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);

    const outputScale = 3;
    const viewport = page.getViewport({ scale: outputScale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    await page.render({
      canvas,
      canvasContext: canvas.getContext('2d') as CanvasRenderingContext2D,
      viewport,
      background: '#ffffff'
    }).promise;

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png')
    );

    if (!blob) {
      throw new Error('Could not convert the PDF to an image.');
    }

    return new File([blob], `${file.name.replace(/\.pdf$/i, '')}.png`, {
      type: 'image/png'
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (!isImage && !isPdf) {
      toast({
        title: 'Unsupported File',
        description:
          'Please upload a PNG/JPG certificate image or a PDF certificate document.',
        variant: 'destructive'
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    let scanTarget: File = file;
    let didConvertPdf = false;

    if (isPdf && !isImage) {
      try {
        scanTarget = await renderPdfToImage(file);
        didConvertPdf = true;
      } catch (err: any) {
        toast({
          title: 'PDF Could Not Be Read',
          description:
            'The PDF could not be processed. Please try an image screenshot of the certificate QR code instead.',
          variant: 'destructive'
        });

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
    }

    try {
      const html5Qrcode = new Html5Qrcode('file-scanner');
      const result = await html5Qrcode.scanFile(scanTarget, false);
      setSearchHash(result);
      verifyCertificate(result);
      await html5Qrcode.clear();

      if (didConvertPdf) {
        toast({
          title: 'PDF Processed',
          description: 'Certificate extracted from PDF and QR code detected.'
        });
      }
    } catch (err: any) {
      toast({
        title: 'Scan Failed',
        description:
          'Could not find a valid QR code in ' +
          (didConvertPdf ? 'the PDF document' : 'the uploaded image') +
          '. Ensure the certificate QR code is clearly visible.',
        variant: 'destructive'
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetVerification = () => {
    setVerificationResult(null);
    setSearchHash('');
    setShowCertificatePreview(false);
  };

  const getCertificateNumber = () => {
    if (verificationResult?.certificate?.certificateNumber) {
      return verificationResult.certificate.certificateNumber;
    }

    if (verificationResult?.localData?.certificateNumber) {
      return verificationResult.localData.certificateNumber;
    }

    if (verificationResult?.certificate) {
      const cert = verificationResult.certificate;
      return `CERT-${cert.issueYear}-${cert.enrollmentNumber
        .toString()
        .slice(-4)
        .padStart(4, '0')}`;
    }

    return 'CERTIFICATE';
  };

  const getStudentName = () => {
    return (
      verificationResult?.certificate?.studentName ||
      verificationResult?.localData?.studentName ||
      'Student Name'
    );
  };

  const getCourse = () => {
    return (
      verificationResult?.certificate?.course ||
      verificationResult?.localData?.course ||
      'Course Name'
    );
  };

  const getInstitution = () => {
    return (
      verificationResult?.certificate?.institution ||
      verificationResult?.localData?.institution ||
      'Institute Name'
    );
  };

  const getCertificateHash = () => {
    return (
      verificationResult?.certificate?.certificateHash ||
      verificationResult?.localData?.certificateHash ||
      ''
    );
  };

  const getIssueDateString = () => {
    if (verificationResult?.certificate) {
      return new Date(verificationResult.certificate.issueDate * 1000).toISOString();
    }

    if (verificationResult?.localData) {
      return verificationResult.localData.issueDate;
    }

    return new Date().toISOString();
  };

  const downloadPdfFromPreview = async () => {
    if (!previewRef.current) {
      toast({
        title: 'Preview Missing',
        description: 'Certificate preview is not available.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsDownloadingPdf(true);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(previewRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      pdf.save(`${getCertificateNumber()}.pdf`);

      toast({
        title: 'PDF Downloaded',
        description: 'Certificate PDF has been downloaded successfully.'
      });
    } catch (error: any) {
      toast({
        title: 'Download Failed',
        description: error.message || 'Could not generate PDF.',
        variant: 'destructive'
      });
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10 max-w-4xl">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-mono font-medium text-primary mb-3">
              CREDIVIR PROTOCOL • LIVE ATTESTATION VERIFIER
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">On-Chain Credential Attestation</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Verify authentic academic degrees and transcripts directly against Ethereum state
            </p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-1 font-mono text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Contract: {DEFAULT_CONTRACT_ADDRESS.slice(0, 8)}...{DEFAULT_CONTRACT_ADDRESS.slice(-6)}</span>
            </div>
          </div>

          <div id="file-scanner" style={{ display: 'none' }} />

          {verificationResult && (
            <Card
              className={`mb-8 overflow-hidden border shadow-xl ${
                verificationResult.isValid
                  ? 'border-emerald-500/40 bg-emerald-500/[0.03]'
                  : 'border-destructive/40 bg-destructive/[0.03]'
              }`}
            >
              <CardContent className="pt-6 space-y-6">
                {verificationResult.isValid ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-border/50 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle className="h-7 w-7" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                              AUTHENTIC CERTIFICATE
                            </span>
                            <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase">
                              Verified
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {verificationResult.verifiedOnBlockchain
                              ? 'Immutable state verified on Ethereum RPC node'
                              : 'Verified cryptographically from local attestation cache'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-card/60 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                          Credential Identifier
                        </span>
                        <span className="font-mono text-xs font-bold text-primary">
                          {getCertificateNumber()}
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-border/40">
                        <div>
                          <span className="text-xs text-muted-foreground block">Graduate Name</span>
                          <span className="font-semibold text-sm">{getStudentName()}</span>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground block">Enrollment ID</span>
                          <span className="font-mono font-medium text-sm">
                            {verificationResult.certificate?.enrollmentNumber ||
                              verificationResult.localData?.enrollmentNumber || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground block">Academic Program</span>
                          <span className="font-medium text-sm">{getCourse()}</span>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground block">Issuing Authority</span>
                          <span className="font-medium text-sm">{getInstitution()}</span>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground block">Graduation Year</span>
                          <span className="font-mono text-sm">
                            {verificationResult.certificate?.issueYear ||
                              verificationResult.localData?.issueYear || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground block">On-Chain Issuance Date</span>
                          <span className="font-mono text-sm">
                            {verificationResult.certificate
                              ? new Date(verificationResult.certificate.issueDate * 1000).toLocaleDateString()
                              : verificationResult.localData
                              ? new Date(verificationResult.localData.issueDate).toLocaleDateString()
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Hashes & Keys with Copy */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono text-muted-foreground">Cryptographic SHA-256 Digest</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(getCertificateHash(), 'hash')}
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-primary hover:underline"
                          >
                            {copiedHash ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
                          </button>
                        </div>
                        <div className="break-all rounded-lg border border-border/60 bg-muted/40 p-2.5 font-mono text-xs text-muted-foreground">
                          {getCertificateHash() || 'Hash not available'}
                        </div>
                      </div>

                      {verificationResult.certificate?.issuerAddress && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-mono text-muted-foreground">Issuer Ethereum Address</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(verificationResult.certificate!.issuerAddress, 'issuer')}
                              className="inline-flex items-center gap-1 text-[11px] font-mono text-primary hover:underline"
                            >
                              {copiedIssuer ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              <span>{copiedIssuer ? 'Copied' : 'Copy Address'}</span>
                            </button>
                          </div>
                          <div className="break-all rounded-lg border border-border/60 bg-muted/40 p-2.5 font-mono text-xs text-muted-foreground">
                            {verificationResult.certificate.issuerAddress}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-border/40">
                      {verificationResult.localData?.studentPhoto && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                              <User className="h-4 w-4" />
                              View Student Photo
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Student Photo</DialogTitle>
                            </DialogHeader>
                            <div className="flex justify-center py-4">
                              <img
                                src={verificationResult.localData.studentPhoto}
                                alt="Student"
                                className="max-h-[400px] max-w-full rounded-lg object-contain"
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}

                      <Button
                        variant="default"
                        size="sm"
                        className="gap-2 font-medium shadow-sm"
                        onClick={() => setShowCertificatePreview(true)}
                      >
                        <Eye className="h-4 w-4" />
                        View Certificate Document
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 font-medium"
                        onClick={downloadPdfFromPreview}
                        disabled={isDownloadingPdf}
                      >
                        <Download className="h-4 w-4" />
                        {isDownloadingPdf ? 'Generating PDF...' : 'Download PDF'}
                      </Button>
                    </div>

                    <Button onClick={resetVerification} variant="outline" className="w-full">
                      Verify Another Certificate
                    </Button>
                  </div>
                ) : (
                  <div className="py-6 text-center space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                      <XCircle className="h-10 w-10" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-destructive">✗ UNVERIFIED / FORGED CREDENTIAL</h3>
                      <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
                        This certificate hash does not exist in the Ethereum smart contract registry. It may be altered, invalid, or never officially issued.
                      </p>
                    </div>
                    <Button onClick={resetVerification} variant="outline">
                      Try Another Certificate
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {!verificationResult && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Choose Verification Method</CardTitle>
                <CardDescription>
                  Verify using certificate hash, verify link, or QR image upload
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="hash" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="hash" className="gap-2">
                      <Search className="h-4 w-4" />
                      Hash / Link
                    </TabsTrigger>
                    <TabsTrigger value="upload" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="hash" className="mt-6 space-y-4">
                    <div>
                      <Label htmlFor="hash">Certificate Hash or Verify Link</Label>
                      <Input
                        id="hash"
                        placeholder="Enter certificate hash or public verify URL"
                        value={searchHash}
                        onChange={(e) => setSearchHash(e.target.value)}
                        className="mt-2 font-mono"
                      />
                    </div>

                    <Button
                      onClick={() => verifyCertificate(searchHash)}
                      disabled={isVerifying}
                      className="w-full gap-2"
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Verifying on Blockchain...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4" />
                          Verify Certificate
                        </>
                      )}
                    </Button>
                  </TabsContent>

                  <TabsContent value="upload" className="mt-6 space-y-4">
                    <div className="rounded-lg border-2 border-dashed border-border py-8 text-center">
                      <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                      <p className="mb-4 text-muted-foreground">
                        Upload a certificate image with QR code
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Upload the certificate image (PNG/JPG) or the issued PDF
                        document. PDFs are rendered and scanned automatically.
                      </p>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />

                      <Button asChild className="mt-4 gap-2">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Upload className="h-4 w-4" />
                          Choose File
                        </label>
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          <Dialog
            open={showCertificatePreview}
            onOpenChange={setShowCertificatePreview}
          >
            <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Verified Certificate Preview</DialogTitle>
              </DialogHeader>

              {verificationResult?.isValid && (
                <div className="space-y-4">
                  <CertificatePreview
                    ref={previewRef}
                    certificateNumber={getCertificateNumber()}
                    studentName={getStudentName()}
                    course={getCourse()}
                    institution={getInstitution()}
                    issueDate={getIssueDateString()}
                    certificateHash={getCertificateHash()}
                    issuerName="Authorized Signatory"
                    issuerTitle="Registrar"
                  />

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={downloadPdfFromPreview}
                      disabled={isDownloadingPdf}
                    >
                      <Download className="h-4 w-4" />
                      {isDownloadingPdf ? 'Downloading...' : 'Download PDF'}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
