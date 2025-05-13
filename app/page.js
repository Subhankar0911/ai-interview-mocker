import Image from 'next/image';

function Header() {
  return <header></header>;
}

export default function Home() {
  return(
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', textAlign: 'center' }}>
     <h2 style={{ color: 'black', fontSize: '2rem' }}> Main Page Before Authentication</h2>
     <button style={{ marginTop: '1rem', border: '2px solid #2563eb', boxSizing: 'border-box', fontWeight: 'bold', backgroundColor: '#2563eb', color: 'black' }}>
      Click here to next page
     </button>
    </div>
  );
}
