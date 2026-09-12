import { useEffect, useState } from 'react';
import {
  ShieldCheck,
  ShieldOff,
  UserPlus,
  Users,
  UserX,
  Loader2,
  Copy,
  Check,
  Inbox,
  Mail,
  CalendarClock
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
import { Switch } from '@/components/ui/switch';
import { useBlockchain } from '@/contexts/BlockchainContext';
import { useToast } from '@/hooks/use-toast';
import { AdminAccessRequest } from '@/lib/blockchain';
import { ethers } from 'ethers';

export function ManageAdmins() {
  const { walletAddress, service, initContract, contractAddress } = useBlockchain();
  const { toast } = useToast();

  const [adminAddress, setAdminAddress] = useState('');
  const [admins, setAdmins] = useState<string[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [submitting, setSubmitting] = useState<'add' | 'remove' | null>(null);
  const [copied, setCopied] = useState(false);

  const [requests, setRequests] = useState<AdminAccessRequest[]>([]);
  const [requestsEnabled, setRequestsEnabled] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [togglingRequests, setTogglingRequests] = useState(false);
  const [handlingRequest, setHandlingRequest] = useState<number | null>(null);

  const loadAdmins = async () => {
    try {
      setLoadingAdmins(true);
      const result = await service.getAllAdmins();
      setAdmins(result);
    } catch (err: any) {
      toast({
        title: 'Failed to Load Admins',
        description: err.message || 'Could not load the admin list.',
        variant: 'destructive'
      });
    } finally {
      setLoadingAdmins(false);
    }
  };

  const loadRequests = async () => {
    try {
      setLoadingRequests(true);
      const [result, enabled] = await Promise.all([
        service.getAdminRequests(),
        service.getAdminRequestsEnabled()
      ]);
      setRequests(result);
      setRequestsEnabled(enabled);
    } catch (err: any) {
      toast({
        title: 'Failed to Load Requests',
        description: err.message || 'Could not load admin requests.',
        variant: 'destructive'
      });
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    loadAdmins();
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyAdmin = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddAdmin = async () => {
    const trimmed = adminAddress.trim();

    if (!ethers.utils.isAddress(trimmed)) {
      toast({
        title: 'Invalid Address',
        description: 'Please enter a valid Ethereum wallet address.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setSubmitting('add');
      const tx = await service.addAdmin(trimmed);
      toast({
        title: 'Adding Admin',
        description: 'Waiting for the transaction to be confirmed...'
      });
      await tx.wait();
      setAdminAddress('');
      await loadAdmins();
      toast({
        title: 'Admin Added',
        description: `${trimmed.slice(0, 8)}...${trimmed.slice(-6)} can now access the admin portal.`
      });
    } catch (err: any) {
      toast({
        title: 'Add Failed',
        description: err.message || 'Transaction failed.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(null);
    }
  };

  const handleRemoveAdmin = async (address: string) => {
    try {
      setSubmitting('remove');
      const tx = await service.removeAdmin(address);
      toast({
        title: 'Removing Admin',
        description: 'Waiting for the transaction to be confirmed...'
      });
      await tx.wait();
      await loadAdmins();
      toast({
        title: 'Admin Removed',
        description: `${address.slice(0, 8)}...${address.slice(-6)} can no longer access the admin portal.`
      });
    } catch (err: any) {
      toast({
        title: 'Remove Failed',
        description: err.message || 'Transaction failed.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(null);
    }
  };

  const isSelf = (address: string) =>
    address.toLowerCase() === walletAddress.toLowerCase();

  const handleToggleRequests = async () => {
    try {
      setTogglingRequests(true);
      const target = !requestsEnabled;
      const tx = await service.setAdminRequestsEnabled(target);
      toast({
        title: target ? 'Enabling Requests' : 'Disabling Requests',
        description: 'Waiting for the transaction to be confirmed...'
      });
      await tx.wait();
      setRequestsEnabled(target);
      toast({
        title: target ? 'Requests Enabled' : 'Requests Disabled',
        description: target
          ? 'New testers can request admin access again.'
          : 'New admin requests are now blocked.'
      });
    } catch (err: any) {
      toast({
        title: 'Toggle Failed',
        description: err.message || 'Could not update request settings.',
        variant: 'destructive'
      });
    } finally {
      setTogglingRequests(false);
    }
  };

  const handleApproveRequest = async (request: AdminAccessRequest) => {
    try {
      setHandlingRequest(request.index);
      const tx = await service.approveAdminRequest(request.index);
      toast({
        title: 'Approving Request',
        description: 'Waiting for the transaction to be confirmed...'
      });
      await tx.wait();
      await Promise.all([loadRequests(), loadAdmins()]);
      toast({
        title: 'Request Approved',
        description: `${request.name} (${request.requester.slice(0, 8)}...) is now an admin.`
      });
    } catch (err: any) {
      toast({
        title: 'Approval Failed',
        description: err.message || 'Transaction failed.',
        variant: 'destructive'
      });
    } finally {
      setHandlingRequest(null);
    }
  };

  const handleRejectRequest = async (request: AdminAccessRequest) => {
    try {
      setHandlingRequest(request.index);
      const tx = await service.rejectAdminRequest(request.index);
      toast({
        title: 'Rejecting Request',
        description: 'Waiting for the transaction to be confirmed...'
      });
      await tx.wait();
      await loadRequests();
      toast({
        title: 'Request Rejected',
        description: `${request.name}'s access request was rejected.`
      });
    } catch (err: any) {
      toast({
        title: 'Reject Failed',
        description: err.message || 'Transaction failed.',
        variant: 'destructive'
      });
    } finally {
      setHandlingRequest(null);
    }
  };

  const pendingRequests = requests
    .filter((r) => !r.resolved)
    .sort((a, b) => b.requestTime - a.requestTime);

  const formatTime = (ts: number) =>
    new Date(ts * 1000).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Add Admin Wallet
          </CardTitle>
          <CardDescription>
            Authorize a new wallet to access the admin portal. Ask the tester for
            their MetaMask wallet address and paste it here.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <div className="flex-1">
              <Label htmlFor="admin-address">Tester Wallet Address</Label>
              <Input
                id="admin-address"
                placeholder="0x..."
                value={adminAddress}
                onChange={(e) => setAdminAddress(e.target.value)}
                className="mt-2 font-mono"
              />
            </div>

            <Button
              onClick={handleAddAdmin}
              disabled={!!submitting}
              className="gap-2"
            >
              {submitting === 'add' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              {submitting === 'add' ? 'Adding...' : 'Add Admin'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <Inbox className="h-5 w-5 text-primary" />
              Admin Access Requests
            </span>

            <span className="flex items-center gap-2 text-sm font-normal">
              <span className="text-muted-foreground">
                {requestsEnabled ? 'Accepting' : 'Closed'}
              </span>
              <Switch
                checked={requestsEnabled}
                onCheckedChange={handleToggleRequests}
                disabled={togglingRequests}
                aria-label="Toggle admin access requests"
              />
            </span>
          </CardTitle>
          <CardDescription>
            Testers who want admin access submit a request here. Approve to add
            them, or keep requests closed to block new submissions.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loadingRequests ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : pendingRequests.length === 0 ? (
            <div className="rounded-lg border border-dashed py-8 text-center">
              <Mail className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No pending admin requests.{' '}
                {requestsEnabled
                  ? 'Testers can request access from the admin login screen.'
                  : 'Requests are currently closed to block spam.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div
                  key={request.index}
                  className="rounded-lg border border-border/60 bg-muted/30 p-4"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{request.name}</p>
                        <p className="break-all font-mono text-[11px] text-muted-foreground">
                          {request.requester}
                        </p>
                      </div>
                    </div>

                    <span className="flex shrink-0 items-center gap-1 rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                      <CalendarClock className="h-3 w-3" />
                      {formatTime(request.requestTime)}
                    </span>
                  </div>

                  {request.email && (
                    <p className="mb-1 text-xs text-muted-foreground">
                      <strong>Email:</strong> {request.email}
                    </p>
                  )}
                  {request.reason && (
                    <p className="mb-3 text-xs text-muted-foreground">
                      <strong>Reason:</strong> {request.reason}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="gap-1.5"
                      onClick={() => handleApproveRequest(request)}
                      disabled={handlingRequest === request.index}
                    >
                      {handlingRequest === request.index ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <ShieldCheck className="h-3.5 w-3.5" />
                      )}
                      Approve & Add as Admin
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 text-destructive"
                      onClick={() => handleRejectRequest(request)}
                      disabled={handlingRequest === request.index}
                    >
                      {handlingRequest === request.index ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <UserX className="h-3.5 w-3.5" />
                      )}
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Authorized Admins
          </CardTitle>
          <CardDescription>
            Wallets currently allowed to access the admin portal.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loadingAdmins ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : admins.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No admins found.
            </p>
          ) : (
            <div className="space-y-3">
              {admins.map((address) => {
                const self = isSelf(address);

                return (
                  <div
                    key={address}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/30 p-3"
                  >
                    <div className="min-w-0 flex items-center gap-2">
                      {self ? (
                        <ShieldCheck className="h-4 w-4 shrink-0 text-success" />
                      ) : (
                        <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                      )}
                      <div className="min-w-0">
                        <span className="break-all font-mono text-xs">{address}</span>
                        {self && (
                          <span className="ml-2 rounded bg-success/10 px-1.5 py-0.5 text-[10px] font-semibold text-success">
                            You
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => copyAdmin(address)}
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-success" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>

                      {!self && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 text-destructive"
                          onClick={() => handleRemoveAdmin(address)}
                          disabled={!!submitting}
                        >
                          {submitting === 'remove' ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <ShieldOff className="h-3.5 w-3.5" />
                          )}
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
        <p>
          <strong>How to share with testers:</strong> Ask the tester to connect
          their own MetaMask wallet on the Admin Portal and share their wallet
          address with you. Add it here, refresh, and they can log in with their
          own account — your private key is never shared.
        </p>
      </div>
    </div>
  );
}