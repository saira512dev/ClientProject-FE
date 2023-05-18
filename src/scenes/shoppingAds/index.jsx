import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Header from "../../components/Header";
import {
  useGetProductsQuery,
  useGetSearchProductsQuery,
  useGetLocationAndLanguagesQuery,
} from "../../state/api";
import SearchBar from "../../components/SearchBar";
import NativeSelect from "@mui/material/NativeSelect";

const ProductImageLinks = ({ links }) => {
  
  return (
    <div>
      {links.map((link, index) => (
        <Typography
        mb="0.5rem"
        sx={{ fontSize: 14 }}
        gutterBottom
      >
        <a mb="0.5rem" key={index} href={link}>
          {link}
        </a>
        </Typography>
      ))}
    </div>
  );
};

const Product = ({
  mainTitle,
  description,
  title,
  seller,
  price,
  currency,
  product_images,
  rating,
  type,
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      sx={{
        paddingRight: "0.5rem",
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.5rem",
      }}
    >
      <CardContent>
        <Typography
          mb="0.5rem"
          sx={{ fontSize: 14 }}
          color={theme.palette.secondary[100]}
          gutterBottom
        >
          {title}
        </Typography>
        <Typography mb="0.5rem" variant="h5" component="div">
          {seller}
        </Typography>
        <Typography
          mb="0.5rem"
          sx={{ mb: "1.5rem" }}
          color={theme.palette.secondary[100]}
        >
          {price}
        </Typography>
        <Typography mb="0.5rem" variant="body2">
          {currency}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="primary"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          See More
        </Button>
      </CardActions>
      <Collapse
        in={isExpanded}
        timeOut="auto"
        unmountOnExit
        sx={{
          color: theme.palette.neutral[300],
        }}
      >
        <CardContent>
          <Typography   mb="0.5rem">{mainTitle}</Typography>
          <Typography    mb="0.5rem">{description}</Typography>
          <Typography   mb="0.5rem">{rating}</Typography>
          <p>
          <Typography    mb="0.5rem">{type}</Typography>
          </p>
          <ProductImageLinks links={product_images} />
        </CardContent>
      </Collapse>
    </Card>
  );
};

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [productsData, setProductsData] = useState("");
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");
  const [languages, setLanguages] = useState([]);
  const { data, isLoading } = useGetProductsQuery();
  const countries = useGetLocationAndLanguagesQuery().data || [];
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  console.log(data);
  const responseinfo = useGetSearchProductsQuery(
    { searchQuery },
    { refetchOnMountOrArgChange: true }
  );

  const theme = useTheme();

  const handleCountryChange = (e) => {
    const selectedCountry = countries.find(
      (country) => country.location_code == e.target.value
    );
    const languagesOfSelectedCountry = selectedCountry.available_languages;
    setCountry(selectedCountry.location_code);
    setLanguages(languagesOfSelectedCountry);
  };

  const handleLanguageChanges = (e) => {
    setLanguage(e.target.value);
  };

  const handleSearchQuery = useCallback(async (e) => {
    if (e.code === "Enter") {
      setSearchQuery({ query: e.target.value, country, language });
      setCountry("");
      setLanguage("");
    }
    if (responseinfo && responseinfo.status == "rejected") {
      setProductsData(null);
    }
  });

  useEffect(() => {
    if (responseinfo && responseinfo.status == "rejected" && searchQuery) {
      setErrorMessage("NO RESULTS AVAILABLE");
      setProductsData(null);
    }

    if (responseinfo && responseinfo.status == "fulfilled") {
      setErrorMessage("");
      setProductsData(responseinfo.data);
    }
  }, [responseinfo]);

  useEffect(() => {
    if (data) setProductsData(data);
  }, [data]);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="SHOPPING ADS" subtitle="See your list of ads." />
      <Box
        className="query_input_elements"
        mb="1rem"
        display="flex"
        justifyContent="flex-start"
        gap="1rem"
      >
        <SearchBar mb="0.5rem" handleSearchQuery={handleSearchQuery} />
        <Box>
          <NativeSelect
            required
            fullWidth
            onChange={handleCountryChange}
            defaultValue={30}
            inputProps={{
              name: "country",
              id: "country",
            }}
          >
            <option value="">Country</option>
            {countries.map((country) => {
              return (
                <option
                  key={country.location_code}
                  value={country.location_code}
                >
                  {country.location_name}
                </option>
              );
            })}
          </NativeSelect>
        </Box>
        {country && (
          <Box>
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
              <option value="">Language</option>
              {languages.map((language) => {
                console.log(language);
                return (
                  <option
                    key={language.language_code}
                    value={language.language_code}
                  >
                    {language.language_name}
                  </option>
                );
              })}
            </NativeSelect>
          </Box>
        )}
      </Box>
      <Box>
        <Typography
          variant="h4"
          mt="0.3rem"
          sx={{ color: `${theme.palette.secondary[100]}` }}
        >
          {errorMessage}
        </Typography>
      </Box>
      {data || !isLoading ? (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          justifyContent="space-between"
          rowGap="20px"
          columnGap="1.33%"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          {productsData &&
            productsData[0] &&
            productsData[0].items.map((item, index) => (
              <Product
                key={index}
                mainTitle={productsData[0].title}
                description={productsData[0].description}
                title={item.title}
                seller={item.seller}
                price={item.price}
                currency={item.currency}
                rating={item.product_rating && item.product_rating.value}
                product_images={item.product_images}
                type={item.type}
              />
            ))}
        </Box>
      ) : (
        <>Loading...</>
      )}
    </Box>
  );
};

export default Products;
