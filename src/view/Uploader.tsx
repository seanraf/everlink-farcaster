import axios from 'axios';
import JSZip from 'jszip';
import Dark from './previews/Dark';
import Light from './previews/Light';
import ReactDOMServer from 'react-dom/server';
import { useAuth } from '@crossmint/client-sdk-react-ui';
import type { DomainContent, UploaderProps } from '../types';
import { useFrameContext } from '../providers/FarcasterContextProvider';
import { Box } from '../components/Box';

export default function Uploader({
  setActiveStep,
  selectedTheme,
  userName,
  bio,
  urlButtons,
  setDeploymentTaskId,
  setSnackbar,
  setLoading,
}: UploaderProps) {
  const { user } = useAuth();
  const { context } = useFrameContext();
  const backendBase = import.meta.env.VITE_BACKEND_BASE_URL as string;
  const everlandHostingBase = import.meta.env
    .VITE_4EVERLAND_HOSTING_BASE_URL as string;
  const everlandTokenId = import.meta.env.VITE_TOKEN_ID as string;
  const everlandProjectId = import.meta.env.VITE_PROJECT_ID as string;
  const frontendBaseUrl = import.meta.env.VITE_FRONTEND_BASE_URL as string;
  const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL as string;
  const shortIoUrl = import.meta.env.VITE_SHORT_IO_BASE_URL as string;
  const domain = import.meta.env.VITE_DOMAIN_NAME as string;
  const apiKey = import.meta.env.VITE_SHORT_IO_API_KEY as string;

  const saveDeploymentData = async (
    content: DomainContent,
    farcasterId: string | number | undefined
  ) => {
    if (!farcasterId) {
      setSnackbar({
        open: true,
        message: 'Authentication Failed. Please try again.',
        severity: 'error',
      });
      setTimeout(() => (window.location.href = '/'), 1000);
      return;
    }
    try {
      const response = await axios.post(
        `${backendBase}/api/deploymentHistory/create`,
        {
          content,
          farcasterId,
        }
      );
      return response;
    } catch (error) {
      console.error('Error saving deployment data:', error);
    }
  };

  const generateCustomURL = async (taskId: string) => {
    if (!taskId) {
      return;
    }

    try {
      const response = await axios.post(
        shortIoUrl,
        {
          originalURL: `${frontendBaseUrl}/${taskId}`,
          domain,
        },
        {
          headers: {
            authorization: apiKey,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error shortening URL:', error);
    }
  };

  const saveDomainData = async (
    taskId: string,
    latestLink: string,
    shortIoId: string
  ) => {
    if (!taskId || !latestLink || !shortIoId) {
      setSnackbar({
        open: true,
        message: 'Oops! Something went wrong. Please try again.',
        severity: 'error',
      });
      setTimeout(() => (window.location.href = '/'), 1000);
      return;
    }

    try {
      await axios.put(`${backendBaseUrl}/api/deploymentHistory/${taskId}`, {
        customUrl: latestLink,
        shortUrlId: shortIoId,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error saving domain data:', error);
      setSnackbar({
        open: true,
        message: 'Server Error. Please try again.',
        severity: 'error',
      });
      setTimeout(() => (window.location.href = '/'), 1000);
    }
  };

  const uploadHTMLFile = async (file: Blob) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', everlandProjectId);

    try {
      const uploadResponse = await axios.post(
        `${everlandHostingBase}/deploy`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            token: everlandTokenId,
          },
        }
      );

      const content = uploadResponse?.data?.content;
      const taskId = content?.taskId;
      setDeploymentTaskId(taskId);
      const farcasterId = user?.farcaster?.fid ?? context?.user?.fid;
      await saveDeploymentData(content, farcasterId);
      const customUrlData = await generateCustomURL(taskId);
      await saveDomainData(
        taskId,
        customUrlData?.shortURL,
        customUrlData?.idString
      );
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleMintData = async () => {
    let themeComponent;

    switch (selectedTheme) {
      case 'Dark Theme':
        themeComponent = (
          <Dark userName={userName} bio={bio} urlButtons={urlButtons} />
        );
        break;
      case 'Light Theme':
        themeComponent = (
          <Light userName={userName} bio={bio} urlButtons={urlButtons} />
        );
        break;
      default:
        return null;
    }

    const themeHTML = ReactDOMServer.renderToString(themeComponent);

    const fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">         
            <style>
              body { width: 90%; margin-left:auto; margin-right:auto }
              @media (min-width: 768px) and (max-width: 1024px) {
                body {
                  width: 60%;
                }
              }
              @media (min-width: 1024px) {
                body {
                  width: 30%;
                }
              }
              div {
                box-sizing: border-box;
              }
            </style>
          </head>
          <body>
            <div>${themeHTML}</div>
          </body>
        </html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });

    const zip = new JSZip();
    zip.file('index.html', blob);

    const zipBlob = await zip.generateAsync({ type: 'blob' });

    uploadHTMLFile(zipBlob);
  };

  const handleBack = () => setActiveStep(0);
  const handleMint = async () => {
    setLoading(true);
    await handleMintData();
    setActiveStep(2);
  };

  return (
    <Box className='flex gap-5 mt-3'>
      <button
        type='button'
        className='flex justify-center px-4  py-3 w-full bg-transparent border border-[#1ab4a3] text-[#1ab4a3] rounded-lg font-bold cursor-pointer'
        onClick={handleBack}
      >
        Back
      </button>
      <button
        className='flex justify-center px-4 py-3 w-full bg-[#1ab4a3] border  border-[#1ab4a3] text-white rounded-lg font-bold cursor-pointer'
        onClick={handleMint}
      >
        Next
      </button>
    </Box>
  );
}
