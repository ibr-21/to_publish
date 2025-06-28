import {
  Container,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Slider,
  SliderFilledTrack,
  SliderTrack,
  SliderThumb,
  FormControl,
  FormLabel
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/product";
import ProductCard from "../components/ProductCard";

const HomePage = () => {
  const { fetchProducts, products } = useProductStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
    return matchesSearch && matchesPrice;
  });

  // console.log(filteredProducts)

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
 

  const handleMinChange = (val) => {
    const value = Number(val);
    setMinPrice(value);
    if (value > maxPrice) setMaxPrice(value);
  };

  const handleMaxChange = (val) => {
    const value = Number(val);
    setMaxPrice(value);
    if (value < minPrice) setMinPrice(value);
  };
  const formatPrice = (val) =>
    val === "" ? "" : parseFloat(val).toLocaleString();

  const parsePrice = (val) => val.replace(/,/g, ""); // remove commas for internal state

  return (
    <Container maxW="container.xl" py={12}>
      <HStack>
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          mb={6}
        />
      </HStack>
      <HStack spacing={4} align="flex-end">
        <FormControl>
          <FormLabel>Min Price</FormLabel>
          <NumberInput
            value={formatPrice(minPrice)}
            min={0}
            onChange={(val) => handleMinChange(parsePrice(val))}
          >
            <NumberInputField placeholder="Min Price" />
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Max Price</FormLabel>
          <NumberInput
            value={formatPrice(maxPrice)}
            onChange={(val) => handleMaxChange(parsePrice(val))}
            min={0}
          >
            <NumberInputField placeholder="Max Price" />
          </NumberInput>
        </FormControl>
      </HStack>
      <Slider
        aria-label="price-slider"
        color="green.200"
        defaultValue={1000}
        min={0}
        max={100000}
        step={10}
        onChange={(val) => setMaxPrice(val)}
        mt={2}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>

      <VStack spacing={8}>
        <Text
          fontSize={"30"}
          fontWeight={"bold"}
          bgGradient={"linear(to-r, cyan.400, blue.500)"}
          bgClip={"text"}
          textAlign={"center"}
        >
          Current Products 🚀
        </Text>

        <SimpleGrid
          columns={{
            base: 1,
            md: 2,
            lg: 3,
          }}
          spacing={10}
          w={"full"}
        >
          {filteredProducts.map((product) => {
            console.log("Rendering product:", product);
            return <ProductCard key={product._id} product={product} />;
          })}
        </SimpleGrid>

        {products.length === 0 && (
          <Text
            fontSize="xl"
            textAlign={"center"}
            fontWeight="bold"
            color="gray.500"
          >
            No products found 😢{" "}
            <Link to={"/create"}>
              <Text
                as="span"
                color="blue.500"
                _hover={{ textDecoration: "underline" }}
              >
                Create a product
              </Text>
            </Link>
          </Text>
        )}
      </VStack>
    </Container>
  );
};
export default HomePage;
