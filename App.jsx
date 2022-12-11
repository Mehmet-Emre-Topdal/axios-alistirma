import { useState } from "react";
import { Card, TextField, Button } from "@mui/material";
import "./App.css";
import { Box } from "@mui/system";
import axios from "axios";

function App() {
  //input elemanından veri çekmek için  state
  const [name, setName] = useState("");

  //APİ çağrısından gelecek veri veya hataların gösterimi için stateler
  //ayrıca veri çekmeden önce verinin yüklendiğini göstermek için isLoadingstatei tanımlandı
  const [countryData, setCountryData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async function () {
    // * Başlangıç aşamaları
    setCountryData(null); //anlamak için veri gösterme kısmına bak
    setIsLoading(true); //veri çekmeye başladık
    setError(null); //henüz hata almadık

    try {
      //! VERİ ÇEKME
      // * başka bir api'de şuan veri çekme işlemi bitmiş bile olabilir
      const response = await axios.get(
        `https://restcountries.com/v3.1/name/${name}`
      );

      //fakat bu api  veriyi .data[0] da saklamış
      const responseData = response.data[0]; //verinin kendisine ulaştık

      // ! FİLTRELEME (APİlere göre değişir)
      //* objeler iiçnde gezinmek için for-in kullanacağını bil yeter
      const data = {};

      for (const key in responseData) {
        if (key === "capital") {
          data.capital = responseData["capital"][0];
        }
      }

      //* BİTTİ
      setCountryData(data);
    } catch (err) {
      //* error parametresini almayı unutma
      //! HATA KONTROLÜ
      // * axios otomatik olarak hata throw edip seni buraya sokuyor.
      setError(err.message);
    }

    setIsLoading(false); //hata olsun veya olmasın veri çekme işlemi bitti
  };

  //! SONUCUN EKRANDA GÖSTERİLMESİ
  //* fetch fonskiyonu içinde state işlemi yaptığın için re-render olucak
  //* re-render sonrası burda seçtiklerinden bir tanesi ekrana basılacak
  //* bunları fonksiyon içinde yazmamak garip ama

  let content;

  if (countryData) content = <p>{countryData.capital}</p>;

  if (error) content = <p>{error}</p>;

  if (isLoading) content = <p>Loading...</p>;

  return (
    <div className="App">
      <Card sx={{ p: 5 }}>
        <Box>
          <TextField
            id="outlined-basic"
            label="Country"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{ height: 55, ml: 1 }}
            onClick={fetchData}
          >
            Search
          </Button>
        </Box>
        <Card sx={{ mt: 2, p: 2 }}>{content}</Card>
      </Card>
    </div>
  );
}

export default App;
