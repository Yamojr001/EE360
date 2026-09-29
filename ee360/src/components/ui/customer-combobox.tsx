import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/lib/api';

interface Customer {
  id: number;
  name: string;
  phone?: string;
  sector_id?: number;
}

interface CustomerComboboxProps {
  value: string; // The text value for buyer
  onChange: (value: string, customerId?: number) => void;
  sectorId?: number;
  placeholder?: string;
}

export function CustomerCombobox({ value, onChange, sectorId, placeholder = "Select or type customer..." }: CustomerComboboxProps) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [phone, setPhone] = useState('');

  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: () => api.get('/customers').then(r => r.data),
  });

  const createMut = useMutation({
    mutationFn: (d: any) => api.post('/customers', { ...d, sector_id: sectorId }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer added');
      onChange(res.data.name, res.data.id);
      setAddOpen(false);
      setOpen(false);
      setPhone('');
    },
  });

  const handleAdd = () => {
    if (!search.trim()) return;
    createMut.mutate({ name: search.trim(), phone });
  };

  const exactMatch = customers.find(c => c.name.toLowerCase() === search.trim().toLowerCase());

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            {value || <span className="text-muted-foreground">{placeholder}</span>}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder="Search customers..." 
              value={search} 
              onValueChange={setSearch} 
            />
            <CommandList>
              <CommandEmpty className="p-2 space-y-1">
                {search.trim() ? (
                  <div className="space-y-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full justify-start text-primary text-xs" 
                      onClick={() => { 
                        onChange(search.trim()); 
                        setOpen(false); 
                      }}
                    >
                      <Plus className="mr-2 h-3.5 w-3.5" /> Use "{search.trim()}" (Auto-save)
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="w-full justify-start text-xs text-muted-foreground" 
                      onClick={() => { setOpen(false); setAddOpen(true); }}
                    >
                      + Add with full contact info
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-center text-muted-foreground py-4">Type to search or add</p>
                )}
              </CommandEmpty>
              <CommandGroup>
                {customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map((customer) => (
                  <CommandItem
                    key={customer.id}
                    value={customer.name}
                    onSelect={() => {
                      onChange(customer.name, customer.id);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 shrink-0",
                            value === customer.name ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="truncate">{customer.name}</span>
                      </div>
                      {customer.balance !== undefined && customer.balance !== 0 && (
                        <span className={cn(
                          "text-[10px] font-bold px-1.5 py-0.5 rounded ml-2 shrink-0",
                          customer.balance > 0 ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300" : "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
                        )}>
                          {customer.balance > 0 ? `+₦${Number(customer.balance).toLocaleString()}` : `-₦${Math.abs(Number(customer.balance)).toLocaleString()}`}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            {search.trim() && !exactMatch && (
              <div className="p-1 border-t flex flex-col gap-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full justify-start text-primary text-xs h-7" 
                  onClick={() => { 
                    onChange(search.trim()); 
                    setOpen(false); 
                  }}
                >
                  <Plus className="mr-2 h-3.5 w-3.5" /> Quick Use "{search.trim()}"
                </Button>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Customer Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <Label>Customer Name</Label>
              <Input value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Phone Number (Optional)</Label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 08012345678" />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!search.trim() || createMut.isPending}>Save & Select</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
