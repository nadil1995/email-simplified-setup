
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Mail, Plus, Trash, User, Users } from "lucide-react";
import { emailPlatformAPI, emailSetupAPI } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

interface EmailSetup {
  id: number;
  domain: string;
  provider: string;
  emailName: string;
  addUsers: boolean;
}

interface EmailAccount {
  id: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

const ManageAccounts = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [emailSetups, setEmailSetups] = useState<EmailSetup[]>([]);
  const [selectedSetup, setSelectedSetup] = useState<EmailSetup | null>(null);
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state for new account
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailName, setEmailName] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    emailName: "",
    password: ""
  });

  // Fetch email setups on component mount
  useEffect(() => {
    const fetchSetups = async () => {
      try {
        const data = await emailSetupAPI.getAllSetups();
        setEmailSetups(data);
        if (data.length > 0) {
          setSelectedSetup(data[0]);
        }
      } catch (error) {
        console.error("Error fetching email setups:", error);
        toast({
          title: "Error",
          description: "Failed to load email setups.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSetups();
  }, [toast]);

  // Mock data for email accounts - in a real app, this would come from an API
  useEffect(() => {
    if (selectedSetup) {
      // This would be replaced with an actual API call
      const mockAccounts: EmailAccount[] = [
        {
          id: "1",
          emailAddress: `${selectedSetup.emailName}@${selectedSetup.domain}`,
          firstName: "Primary",
          lastName: "Admin",
          isAdmin: true
        },
        {
          id: "2",
          emailAddress: `sales@${selectedSetup.domain}`,
          firstName: "Sales",
          lastName: "Team",
          isAdmin: false
        },
        {
          id: "3",
          emailAddress: `support@${selectedSetup.domain}`,
          firstName: "Support",
          lastName: "Team",
          isAdmin: false
        }
      ];
      setEmailAccounts(mockAccounts);
    }
  }, [selectedSetup]);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setFormErrors({
      firstName: "",
      lastName: "",
      emailName: "",
      password: ""
    });
    
    // Validate form
    let hasError = false;
    if (!firstName) {
      setFormErrors(prev => ({ ...prev, firstName: "First name is required" }));
      hasError = true;
    }
    if (!lastName) {
      setFormErrors(prev => ({ ...prev, lastName: "Last name is required" }));
      hasError = true;
    }
    if (!emailName) {
      setFormErrors(prev => ({ ...prev, emailName: "Email name is required" }));
      hasError = true;
    }
    if (!password || password.length < 8) {
      setFormErrors(prev => ({ ...prev, password: "Password must be at least 8 characters" }));
      hasError = true;
    }
    
    if (hasError || !selectedSetup) return;
    
    try {
      // Call API to create account
      await emailPlatformAPI.createEmailAccount({
        provider: selectedSetup.provider,
        domain: selectedSetup.domain,
        emailName,
        firstName,
        lastName,
        password
      });
      
      toast({
        title: "Success",
        description: `Account ${emailName}@${selectedSetup.domain} created successfully.`,
      });
      
      // Add mock account to the list (in a real app, we would refetch)
      const newAccount: EmailAccount = {
        id: Date.now().toString(),
        emailAddress: `${emailName}@${selectedSetup.domain}`,
        firstName,
        lastName,
        isAdmin: false
      };
      
      setEmailAccounts(prev => [...prev, newAccount]);
      
      // Reset form
      setFirstName("");
      setLastName("");
      setEmailName("");
      setPassword("");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating email account:", error);
      toast({
        title: "Error",
        description: "Failed to create email account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = (id: string) => {
    // In a real app, this would call an API
    setEmailAccounts(prev => prev.filter(account => account.id !== id));
    
    toast({
      title: "Account Deleted",
      description: "The email account has been deleted.",
    });
  };

  const handleSelectSetup = (setup: EmailSetup) => {
    setSelectedSetup(setup);
  };

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading email setups...</p>
        </div>
      </div>
    );
  }

  if (emailSetups.length === 0) {
    return (
      <div className="container max-w-lg py-12 mx-auto text-center">
        <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Email Setups Found</h1>
        <p className="text-muted-foreground mb-6">
          You need to set up an email domain before you can manage accounts.
        </p>
        <Button onClick={() => navigate("/")}>Create Email Setup</Button>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Manage Email Accounts</h1>
            <p className="text-muted-foreground">Create and manage email accounts for your domains</p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" /> Add Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Email Account</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateAccount} className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        value={firstName} 
                        onChange={e => setFirstName(e.target.value)}
                        className={formErrors.firstName ? "border-destructive" : ""}
                      />
                      {formErrors.firstName && (
                        <p className="text-xs text-destructive">{formErrors.firstName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        value={lastName} 
                        onChange={e => setLastName(e.target.value)}
                        className={formErrors.lastName ? "border-destructive" : ""}
                      />
                      {formErrors.lastName && (
                        <p className="text-xs text-destructive">{formErrors.lastName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emailName">Email Address</Label>
                    <div className="flex">
                      <Input 
                        id="emailName" 
                        value={emailName} 
                        onChange={e => setEmailName(e.target.value)}
                        className={`rounded-r-none ${formErrors.emailName ? "border-destructive" : ""}`}
                      />
                      <div className="bg-muted px-3 flex items-center border border-l-0 rounded-r-md">
                        @{selectedSetup?.domain}
                      </div>
                    </div>
                    {formErrors.emailName && (
                      <p className="text-xs text-destructive">{formErrors.emailName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)}
                      className={formErrors.password ? "border-destructive" : ""}
                    />
                    {formErrors.password && (
                      <p className="text-xs text-destructive">{formErrors.password}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Account</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {emailSetups.length > 1 && (
          <div className="mb-6">
            <Label htmlFor="domainSelect">Select Domain</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
              {emailSetups.map(setup => (
                <Card 
                  key={setup.id} 
                  className={`cursor-pointer transition-all ${selectedSetup?.id === setup.id ? 'border-primary bg-primary/5' : ''}`}
                  onClick={() => handleSelectSetup(setup)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{setup.domain}</p>
                        <p className="text-sm text-muted-foreground">
                          {setup.provider === 'google' ? 'Google Workspace' : 
                           setup.provider === 'microsoft' ? 'Microsoft 365' : 'AWS WorkMail'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {selectedSetup && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Email Accounts for {selectedSetup.domain}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {emailAccounts.map(account => (
                  <div key={account.id} className="flex items-center justify-between border p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{account.emailAddress}</p>
                        <p className="text-sm text-muted-foreground">
                          {account.firstName} {account.lastName} {account.isAdmin && "(Admin)"}
                        </p>
                      </div>
                    </div>
                    
                    {!account.isAdmin && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteAccount(account.id)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ManageAccounts;
