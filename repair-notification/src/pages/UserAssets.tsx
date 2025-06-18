
import { useState, useEffect } from 'react';
import { useRoleBasedApi } from '@/hooks/useRoleBasedApi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from 'lucide-react';

// Sample interface for the assets
interface Asset {
  id: number;
  assetName: string;
  assetCode: string;
  status: string;
  assetType: string;
  assetLocation?: string;
  createdAt: string;
}

const UserAssets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const api = useRoleBasedApi();

  useEffect(() => {
    fetchAssets();
  }, []);

  //ทรัพย์สินของฉัน
  const fetchAssets = async () => {
    try {
      setLoading(true);
      // Use the role-specific API based on the user's role
      let response;
      
      try {
        if (user?.role === 'admin') {
          // Admin role uses getAssets
          if (api.assets && 'getAssets' in api.assets) {
            response = await api.assets.getAssets();
          }
        } else {
          // User role uses getAllAssets
          if (api.assets && 'getAllAssets' in api.assets) {
            response = await api.assets.getAllAssets();
          }
        }
        
        if (!response) {
          // Fallback if API endpoints are not available
          throw new Error('API endpoints not available');
        }
      } catch (apiError) {
        console.error('API error:', apiError);
        // Fallback to empty array if API call fails
        response = { data: [] };
      }
      
      console.log('Assets response:', response);
      
      if (response && response.data) {
        setAssets(response.data);
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
      toast({
        title: 'Failed to load assets',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">ทรัพย์สินของฉัน</h1>
          {user?.role === 'admin' && (
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Add Asset</span>
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : assets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <Card key={asset.id}>
                <CardHeader>
                  <CardTitle>{asset.assetName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Asset Code:</span>
                      <span className="font-medium">{asset.assetCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Type:</span>
                      <span className="font-medium capitalize">{asset.assetType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <span className={`font-medium ${
                        asset.status === 'active' ? 'text-green-600' : 
                        asset.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                      </span>
                    </div>
                    {asset.assetLocation && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Location:</span>
                        <span className="font-medium">{asset.assetLocation}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No assets found.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserAssets;
