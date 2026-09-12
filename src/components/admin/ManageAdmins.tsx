import { useEffect, useState } from 'react';
import { ShieldCheck, ShieldOff, UserPlus, Users, Loader2, Copy, Check } from 'lucide-react';
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
import { useBlockchain } from '@/contexts/BlockchainContext';
import { useToast } from '@/hooks/use-toast';
import { ethers } from 'ethers';

export function ManageAdmins() {
  const { walletAddress, service, initContract, contractAddress } = useBlockchain();
  const { toast } = useToast();

  const [adminAddress, setAdminAddress] = useState('');
  const [admins, setAdmins] = useState<string[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [submitting, setSubmitting] = useState<'add' | 'remove' | null>(null);
  const [copied, setCopied] = useState(false);

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

  useEffect(() => {
    loadAdmins();
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