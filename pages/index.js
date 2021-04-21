import React, { useEffect, useState, createContext } from 'react';
export const TabContext = createContext(undefined);

import Head from 'next/head';
import axios from 'axios';
import styles from '../styles/Home.module.css';

import { SimpleGrid } from '@chakra-ui/react';
import Tabs from '../components/Tabs/Tabs';
import Card from '../components/Card/Card';

export default function Home({ query }) {
  const [templates, setTemplates] = useState([]);
  const [products, setProducts] = useState([]);

  const [currentTab, setCurrentTab] = useState(undefined);
  const [productsNum, setProductsNum] = useState(0);

  useEffect(() => {
    const fetchTemplates = async () => {
      const request = await axios.get(`https://api.kadporastembicu.dev/v1/templates`);

      let arr = request.data.map((item) => {
        item.isSelected = false;
        return { ...item };
      });

      setTemplates(arr);
    };

    fetchTemplates();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const request = await axios.get(`https://api.kadporastembicu.dev/v1/products`);

      let arr = request.data.map((item) => {
        item.isSelected = false;
        return { ...item };
      });

      setProducts(arr);
    };

    fetchProducts();
  }, []);

  return (
    <TabContext.Provider
      value={{
        value: [currentTab, setCurrentTab],
        value2: [productsNum, setProductsNum],
      }}>
      <div className={styles.container}>
        <Head>
          <title>Subscriptions</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <main>
          <Tabs
            products={products}
            templates={templates}
            setTemplates={setTemplates}
            initialTab={query}>
            <div label='templates'>
              <SimpleGrid autoRows='1fr' rowGap='50px' autoFlow="row" minChildWidth='120px' spacingX='90px'>
                {templates.map((temp) => {
                  return (
                    <Card
                      card={temp}
                      setTemplates={setTemplates}
                      templates={templates}
                      isChecked={temp.isSelected}
                      edge={'Edge Delivery'}
                      key={temp._id}
                      id={temp._id}
                      description={temp.description}
                      features={temp.features}
                      price={temp.price}
                      name={temp.name}
                    />
                  );
                })}
              </SimpleGrid>
            </div>
            <div label='products'>
              <SimpleGrid
                autoRows='1fr'
                rowGap='50px'
                autoFlow='row'
                minChildWidth='120px'
                spacingX='90px'>
                {products.map((temp) => {
                  return (
                    <Card
                      setProducts={setProducts}
                      isChecked={temp.isSelected}
                      products={products}
                      key={temp._id}
                      id={temp._id}
                      description={temp.description}
                      features={temp.features}
                      price={temp.price}
                      name={temp.name}
                    />
                  );
                })}
              </SimpleGrid>
            </div>
          </Tabs>
        </main>
      </div>
    </TabContext.Provider>
  );
}

Home.getInitialProps = ({ query }) => {
  return { query };
};
