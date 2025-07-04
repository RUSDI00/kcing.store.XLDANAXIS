interface QRISResponse {
  status: string;
  nominal: string;
  link_qris: string;
  converted_qris: string;
}

const QRIS_DATA = "00020101021126570011ID.DANA.WWW011893600915358278717202095827871720303UMI51440014ID.CO.QRIS.WWW0215ID10243101800040303UMI5204594553033605802ID5909DOLY SHOP6015Kab. Labuhanbat6105214116304A989";
const QRIS_API_URL = "https://cekid-ariepulsa.my.id/api/";

export const generateQRIS = async (nominal: number): Promise<QRISResponse> => {
  try {
    // Ensure nominal is a clean integer without decimal points
    const cleanNominal = Math.floor(nominal);
    console.log('Generating QRIS for nominal:', nominal, 'cleaned to:', cleanNominal);
    
    const url = `${QRIS_API_URL}?qris_data=${encodeURIComponent(QRIS_DATA)}&nominal=${cleanNominal}`;
    console.log('QRIS API URL:', url);
    
    const response = await fetch(url);
    
    console.log('QRIS API Response status:', response.status);
    
    if (!response.ok) {
      console.error('QRIS API response not ok:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('QRIS API error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data: QRISResponse = await response.json();
    console.log('QRIS API Response data:', data);
    
    if (data.status !== 'success') {
      console.error('QRIS generation failed with status:', data.status);
      throw new Error(`QRIS generation failed: ${data.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('QRIS generation error:', error);
    throw new Error('Failed to generate QRIS. Please try again.');
  }
};
