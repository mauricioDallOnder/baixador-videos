import { api } from "@/lib/axios";
import { Box, TextField, Typography, Button } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import logo from '../assets/logo.jpg'
import Image from "next/image";
function HomePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false); // NEW STATE

  const handleDownload = async () => {
    setLoading(true); // Set loading to true at the start

    try {
      const response = await api.post("/download", { url });
      const { success, downloadLink, videoTitle } = response.data;

      if (success) {
        const videoBlobResponse = await axios.get(downloadLink, {
          responseType: "blob",
        });
        const blob = new Blob([videoBlobResponse.data], { type: "video/mp4" });

        const objectURL = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objectURL;
        a.download = videoTitle;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(objectURL);
      } else {
        console.error("Error fetching download link.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Reset loading state whether the download succeeds or fails
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        height:'100vh',
        gap:'49px'
      }}
    >
        <Image src={logo} width={120} height={120} priority quality={100} alt='' style={{borderRadius:'8px'}} />
        <Box sx={{display:'flex',flexDirection:'column',gap:'21px'}}>
      <Typography
        sx={{
          color: "#FFF",
          textAlign: "center",
          textShadow: "0px 4px 4px #54568B",
          fontFamily: "Roboto Mono",
          fontSize: "24px",
          fontWeight: "600",
          lineHeight: "normal",
        }}
      >
        Centro Espirita Alunos do Bem
      </Typography>
      <Typography sx={{
          color: "#FFF",
          textAlign: "center",
          textShadow: "0px 4px 4px #54568B",
          fontFamily: "Roboto Mono",
          fontSize: "18px",
          fontWeight: "400",
          lineHeight: "normal",
        }}>Baixar videos do facebook</Typography>
        </Box>
      <input
        style={{
          width: "300px",
          height: "40px",
          borderRadius: "15px",
          background: "#FFF",
          boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          textAlign:'center'
        }}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="colar aqui o link pra download"
      />
      <Button
        variant="contained"
        sx={{
          borderRadius: "15px",
          background:
            "linear-gradient(97deg, #B816F1 1.82%, #107CFB 1.83%, #17F3BE 100%)",
            boxShadow:'0px 4px 4px 0px rgba(19, 63, 219, 0.25)'
        }}
        onClick={handleDownload}
        disabled={loading}
      >
        {loading ? "Iniciando o download, aguarde..." : "Baixar video"}
      </Button>
    </Box>
  );
}

export default HomePage;
