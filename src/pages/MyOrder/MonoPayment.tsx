// import MomoPaymentForm from "./components/momoPaymentForm";
import { useState } from 'react'
import { createMomoPaymentQR } from '@/apis/order.api'

type MomoFormField = {
  partnerCode: string
  accessKey: string
  secretKey: string
  amount: string
  orderId: string
  orderInfo: string
  redirectUrl: string
  ipnUrl: string
  extraData: string
}
export default function MomoPaymentPage() {

  const [form, setForm] = useState({
    partnerCode: '',
    accessKey: '',
    secretKey: '',
    amount: '',
    orderId: '',
    orderInfo: '',
    redirectUrl: '',
    ipnUrl: '',
    extraData: ''
  })

  const [payUrl, setPayUrl] = useState<string | null>(null);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target

  setForm(prev => ({
    ...prev,
    [name]: value
  }))
}


  const handleSubmit = async () => {
    try {
      const res = await createMomoPaymentQR(form);
      setPayUrl(res.data?.data?.payUrl);
    } catch (error) {
      console.error(error);
      alert("Error creating MoMo QR");
    }
  };

//   const handleSubmit = async () => {
//     try {
//       const res = await axios.post('/api/orders/payment/momo/create-qr', form)
//       setPayUrl(res.data?.data?.payUrl)
//     } catch (error) {
//       console.error(error)
//       alert('Error creating MoMo QR')
//     }
//   }

  return (
    <div style={{ maxWidth: 400, margin: '20px auto', padding: 20 }}>
      <h2>MoMo Payment Generator</h2>

      {(Object.keys(form) as (keyof MomoFormField)[]).map(key => (
        <div key={key} style={{ marginBottom: 10 }}>
          <label>{key}</label>
          <input
            name={key}
            value={form[key]}
            onChange={handleChange}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
      ))}

      <button onClick={handleSubmit} style={{ padding: 10, width: '100%' }}>
        Generate MoMo QR
      </button>

      {payUrl && (
        <div style={{ marginTop: 20 }}>
          <p>QR Payment Link:</p>
          <a href={payUrl} target="_blank" rel="noreferrer">
            {payUrl}
          </a>

          <div style={{ marginTop: 10 }}>
            <img src={payUrl} alt="QR" width={250} />
          </div>
        </div>
      )}
    </div>
  )

}
