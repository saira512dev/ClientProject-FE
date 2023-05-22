import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Box, useTheme, Typography } from "@mui/material";
import Header from "../../components/Header";
import { ResponsiveLine } from "@nivo/line";
import { useGetSalesQuery, useGetSearchSalesQuery, useGetLocationAndLanguagesQuery } from "../../state/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SearchBar from "../../components/SearchBar";
// import { useSelector } from 'react-redux';
import InputLabel from "@mui/material/InputLabel";
import NativeSelect from "@mui/material/NativeSelect";

const Daily = () => {
  const [startDate, setStartDate] = useState(new Date("2021-02-01"));
  const [endDate, setEndDate] = useState(new Date("2021-10-01"));
  const [searchQuery, setSearchQuery] = useState("");
  const [salesData, setSalesData] = useState();
  const [errorMessage, setErrorMessage] = useState("")
  const [country, setCountry] = useState("")
  const [language, setLanguage] = useState("")
  const [languages, setLanguages] = useState([])
  const { data } = useGetSalesQuery();
  const countries = useGetLocationAndLanguagesQuery().data || [];
  // console.log(data)
  const  responseinfo = useGetSearchSalesQuery(
    { searchQuery },
    { refetchOnMountOrArgChange: true }
  );
  
  const theme = useTheme();

  const handleCountryChange = (e) => {
    console.log(e.target.value)
    // setCountry("")
    const selectedCountry = countries.find(country => country.location_code == e.target.value)
    const languagesOfSelectedCountry = selectedCountry.available_languages
    setCountry(selectedCountry.location_code)
    setLanguages(languagesOfSelectedCountry)
    console.log(country)
  };

  const handleLanguageChanges = (e) => {
    console.log("HAI")
    console.log(e.target.value)
    setLanguage(e.target.value)
  };

  const handleSearchQuery = useCallback(async (e) => {
    if (e.code === "Enter") {
      setSearchQuery({query: e.target.value,country, language});
      setCountry("")
      setLanguage("")
    }
    if (
      responseinfo &&
      responseinfo.status == "rejected" 
    ) {
      setSalesData(null);
    } 
    console.log(responseinfo);
    console.log(country, language)

  });

  useEffect(() => {
    if (
      responseinfo &&
      responseinfo.status == "rejected" && searchQuery
    ) {
      setErrorMessage("NO RESULTS AVAILABLE")
      setSalesData(null);
    } 
    
    console.log(responseinfo)
    if (
      responseinfo &&
      responseinfo.status == "fulfilled"
    ) {
      setErrorMessage("")
      setSalesData(responseinfo.data);
    }
    

  }, [responseinfo]);

  useEffect(() => {
    console.log(data)
      setSalesData(data);
     
  }, [data]);

  const [formattedData] = useMemo(() => {
    if (!salesData ) return [];
    console.log("USEMEMO")
    console.log(salesData)
    const dailyData = salesData.data  ? salesData.data : salesData[0]
    if (!dailyData ) return [];
    console.log(dailyData)
    const totalSearchLine = {
      id: "totalSearch",
      color: theme.palette.secondary.main,
      data: [],
    };
  
    // console.log(dailyData.monthlySearches)
    
    Object.values(dailyData.monthlySearches).sort((a, b) => {
      if (a.year === b.year) {
        return a.month - b.month;
      }
      return a.year - b.year;
    }).forEach(({ year, month, search_volume }) => {
      console.log("PREPARING")
      const dateFormatted = new Date(year, month - 1, 1,0,0,0);
      if (dateFormatted >= startDate && dateFormatted <= endDate) {
        const splitDate = `${year.toString().split(-2)}-${month < 10 ? '0'+ month : month}`
  
        totalSearchLine.data = [
          ...totalSearchLine.data,
          { x: splitDate, y: search_volume },
        ];
      }
    });
  
    // console.log(totalSalesLine.data+"data")
    const formattedData = [totalSearchLine];
    return [formattedData];
  }, [salesData, startDate, endDate]);

  console.log("salesData:", salesData);
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="DAILY QUERY" subtitle="Chart of daily query" />
      <Box className="query_input_elements" mb="1rem" display="flex" justifyContent="flex-start" gap="1rem">
        <SearchBar mb="0.5rem" handleSearchQuery={handleSearchQuery}/>
        <Box>
        {/* <InputLabel variant="standard" htmlFor="country">
                  Country
                </InputLabel> */}
                <NativeSelect
                  required
                  fullWidth
                  onChange={handleCountryChange}
                  defaultValue={30}
                  inputProps={{
                    name: "country",
                    id: "country",
                  }}
                  sx={{ bg: theme.palette.background.alt }}
                >
                  <option  value="">
                    Country
                  </option>
                  {countries.map((country) => {
                    return (
                      <option key={country.location_code} value={country.location_code}>
                        {country.location_name}
                      </option>
                    );
                  })}
                </NativeSelect>
        </Box>
        { country && <Box>
        {/* <InputLabel variant="standard" htmlFor="language">
                  Language
                </InputLabel> */}
                <NativeSelect
                  required
                  fullWidth
                  defaultValue={10}
                  onChange={handleLanguageChanges}
                  inputProps={{
                    name: "language",
                    id: "language",
                  }}
                  sx={{ bg: theme.palette.background.alt }}
                >
                  <option value="">
                    Language
                  </option>
                  {languages.map((language) => {
                    console.log(language)
                    return (
                      <option key={language.language_code} value={language.language_code}>
                        {language.language_name}
                      </option>
                    );
                  })}
                </NativeSelect>
        </Box>}
      </Box>

      <Box height="75vh">
      { salesData && formattedData && <Box mt="2rem" display="flex" justifyContent="flex-end">
          <Box>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
            />
          </Box>
          <Box>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
            />
          </Box>
        </Box>}
        <Box>
          <Typography variant="h4" mt="0.3rem" sx={{ color:`${theme.palette.secondary[100]}`}}>
              {errorMessage}
      </Typography>
        </Box>
        {salesData && formattedData &&(
          <ResponsiveLine
            data={formattedData}
            theme={{
              axis: {
                domain: {
                  line: {
                    stroke: theme.palette.secondary[200],
                  },
                },
                legend: {
                  text: {
                    fill: theme.palette.secondary[200],
                  },
                },
                ticks: {
                  line: {
                    stroke: theme.palette.secondary[200],
                    strokeWidth: 1,
                  },
                  text: {
                    fill: theme.palette.secondary[200],
                  },
                },
              },
              legends: {
                text: {
                  fill: theme.palette.secondary[200],
                },
              },
              tooltip: {
                container: {
                  color: theme.palette.primary.main,
                },
              },
            }}
            colors={{ datum: "color" }}
            margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
            xScale={{
              type: "point",
              reverse: false, // Set reverse to false for ascending order
            }}
            yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: false,
            reverse: false,
            }}
            yFormat=" >-.2f"
            curve="catmullRom"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 90,
              legend: "Month",
              legendOffset: 60,
              legendPosition: "middle",
            }}
            axisLeft={{
              orient: "left",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Search_Volume",
              legendOffset: -50,
              legendPosition: "middle",
            }}
            enableGridX={false}
            enableGridY={false}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: "top-right",
                direction: "column",
                justify: false,
                translateX: 50,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        ) }
        
      </Box> 
      {salesData && formattedData && <Box mt="2rem" mb="2rem" sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"

      }}>
      <Typography variant="h4" mt="0.3rem" sx={{ color:`${theme.palette.secondary[100]}`}}>
        COMPETITION LEVEL:
        {salesData.data ? salesData.data.competitionLevel : salesData[0].competitionLevel }
      </Typography>
      <Typography variant="h4" mt="0.3rem" sx={{ color:`${theme.palette.secondary[100]}`}}>
        COMPETITION :
        {salesData.data ? salesData.data.competition : salesData[0].competition }
      </Typography>
      <Typography variant="h4" mt="0.3rem" sx={{ color:`${theme.palette.secondary[100]}`}}>
        CPC:
        {salesData.data ? salesData.data.cpc : salesData[0].cpc }
      </Typography>
        </Box>} 
    </Box>
  );
};

export default Daily;