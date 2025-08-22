import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box } from '../components/Box';
import Loader from './Loader';
import ThankYou from './ThankYou';

export default function SuccessCase() {
  const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL as string;
  const [taskId, setTaskId] = useState<string | undefined>(undefined);
  const [deploymentRecord, setDeploymentRecord] = useState<any>({});
  const [customURL, setCustomURL] = useState('');
  const [loading, setLoading] = useState(true);

  const pathname = window.location.pathname;

  const fetchDeploymentData = async () => {
    try {
      const response = await axios.get(
        `${backendBaseUrl}/api/deploymentHistory/${taskId}`
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
        setTaskId(pathSegments[successIndex + 1]);
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (taskId) {
      fetchDeploymentData();
    }
  }, [taskId]);

  return (
    <Box>
      {!loading ? (
        <>
          {deploymentRecord.taskId ? (
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
