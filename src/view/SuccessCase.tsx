import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box } from '../components/Box';
import Loader from './Loader';
import ThankYou from './ThankYou';
import type { DeploymentRecord } from '../types';

export default function SuccessCase() {
  const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL as string;
  const [ipfsTaskId, setIpfsTaskId] = useState<string | undefined>(undefined);
  const [deploymentRecord, setDeploymentRecord] =
    useState<DeploymentRecord | null>(null);
  const [customURL, setCustomURL] = useState('');
  const [loading, setLoading] = useState(true);

  const pathname = window.location.pathname;
  const fetchDeploymentData = async () => {
    try {
      const response = await axios.get(
        `${backendBaseUrl}/api/deploymentHistory/${ipfsTaskId}`
      );
      const deploymentRecords = response.data.records;
      if (deploymentRecords) {
        setDeploymentRecord(deploymentRecords);
        setCustomURL(deploymentRecords?.customUrl);
      } else {
        console.error('No deployment records found.');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error retrieving deployment data:', error);
      setCustomURL('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pathname) {
      const pathSegments = pathname.split('/');
      const successIndex = pathSegments.indexOf('success');
      if (successIndex !== -1 && pathSegments.length > successIndex + 1) {
        setIpfsTaskId(pathSegments[successIndex + 1]);
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (ipfsTaskId) {
      fetchDeploymentData();
    }
  }, [ipfsTaskId]);

  return (
    <Box>
      {!loading ? (
        <>
          {deploymentRecord?.arweaveUrl || deploymentRecord?.ipfsTaskId ? (
            <ThankYou customURL={customURL} loading={loading} />
          ) : (
            <Box
              style={{
                height: 'calc(100vh - 144px)',
                display: 'flex',
                width: '100%',
              }}
            >
              <Box style={{ margin: 'auto' }}>No Record Found</Box>
            </Box>
          )}
        </>
      ) : (
        <Loader />
      )}
    </Box>
  );
}
