"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Token, TokenStatus } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CheckCircle2,
  Clock,
  Trash2,
  UtensilsCrossed,
  Search,
  X,
} from 'lucide-react';
import TokenForm from './TokenForm';
import TokenDisplayDialog from './TokenDisplayDialog';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

const initialTokens: Token[] = [
  { id: '1', itemName: 'Samosa Chaat', price: 60, status: 'Served', createdAt: new Date(Date.now() - 1000 * 60 * 5) },
  { id: '2', itemName: 'Vegetable Pulao', price: 90, status: 'Pending', createdAt: new Date(Date.now() - 1000 * 60 * 10) },
  { id: '3', itemName: 'Filter Coffee', price: 30, status: 'Pending', createdAt: new Date(Date.now() - 1000 * 60 * 2) },
  { id: '4', itemName: 'Gobi Manchurian', price: 120, status: 'Served', createdAt: new Date(Date.now() - 1000 * 60 * 25) },
  { id: '5', itemName: 'Paneer Butter Masala', price: 150, status: 'Pending', createdAt: new Date(Date.now() - 1000 * 60 * 1) },
];


export default function TokenManager() {
  const [tokens, setTokens] = useState<Token[]>(initialTokens);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<TokenStatus | 'all'>('all');
  const [hydrated, setHydrated] = useState(false);
  const { toast } = useToast();
  const [lastGeneratedToken, setLastGeneratedToken] = useState<Token | null>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const addToken = (tokenData: Omit<Token, 'id' | 'status' | 'createdAt'>) => {
    const newToken: Token = {
      ...tokenData,
      id: crypto.randomUUID(),
      status: 'Pending',
      createdAt: new Date(),
    };
    setTokens((prev) => [newToken, ...prev]);
    setLastGeneratedToken(newToken);
    toast({
      title: 'Token Generated',
      description: `Token for ${newToken.itemName} has been created.`,
    });
  };

  const updateTokenStatus = (id: string, newStatus: TokenStatus) => {
    setTokens((prev) =>
      prev.map((token) =>
        token.id === id ? { ...token, status: newStatus } : token
      )
    );
    toast({
      title: 'Token Updated',
      description: `An order has been marked as ${newStatus}.`,
    });
  };

  const deleteToken = (id: string) => {
    const tokenToDelete = tokens.find(t => t.id === id);
    setTokens((prev) => prev.filter((token) => token.id !== id));
    if (tokenToDelete) {
        toast({
            title: 'Token Deleted',
            description: `Token for ${tokenToDelete.itemName} has been removed.`,
            variant: 'destructive',
        });
    }
  };

  const filteredTokens = useMemo(() => {
    return tokens
      .filter((token) => {
        if (filterStatus === 'all') return true;
        return token.status === filterStatus;
      })
      .filter((token) =>
        token.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [tokens, searchTerm, filterStatus]);
  
  if (!hydrated) {
    return null; // or a loading skeleton
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <UtensilsCrossed className="h-8 w-8" />
            </div>
            <div>
                <h1 className="text-2xl font-bold tracking-tight font-headline">Canteen Token Manager</h1>
                <p className="text-muted-foreground">Streamline your canteen's order-taking process.</p>
            </div>
        </div>
      </div>
      
      <TokenForm addToken={addToken} />

      <TokenDisplayDialog 
        token={lastGeneratedToken} 
        onOpenChange={(isOpen) => {
          if(!isOpen) {
            setLastGeneratedToken(null)
          }
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Current Tokens</CardTitle>
          <CardDescription>
            Manage all active food tokens. There are {filteredTokens.length} tokens matching your criteria.
          </CardDescription>
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by item name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              {searchTerm && <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setSearchTerm('')}><X className="h-4 w-4"/></Button>}
            </div>
            <Select
              value={filterStatus}
              onValueChange={(value: TokenStatus | 'all') => setFilterStatus(value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Served">Served</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTokens.length > 0 ? (
                  filteredTokens.map((token) => (
                    <TableRow key={token.id}>
                      <TableCell className="font-medium">{token.itemName}</TableCell>
                      <TableCell className="text-right">₹{token.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={token.status === 'Served' ? 'default' : 'secondary'} className="capitalize">
                          {token.status === 'Served' ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <Clock className="mr-1 h-3 w-3" />}
                          {token.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDistanceToNow(token.createdAt, { addSuffix: true })}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                            {token.status === 'Pending' && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => updateTokenStatus(token.id, 'Served')}
                                >
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <span className="sr-only">Mark as Served</span>
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteToken(token.id)}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Delete Token</span>
                            </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No tokens found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
