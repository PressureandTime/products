import React, { useContext } from 'react';
import { Button, ListItem, Box, UnorderedList, Text, Heading } from '@chakra-ui/react';
import { FaCheck } from 'react-icons/fa';

import { TabContext } from '../../pages';

import styles from './Card.module.css';

const Card = ({
  description,
  features,
  name,
  price,
  edge,
  id,
  isChecked,
  templates,
  products,
  setTemplates,
  setProducts,
}) => {
  const { value } = useContext(TabContext);
  const [currentTab] = value;

  const check = () => {
    if (edge) {
      return (
        <h5 className={styles.lower_container__heading}>
          {edge} | {name}
        </h5>
      );
    } else {
      return <h5 className={styles.lower_container__heading}>{name}</h5>;
    }
  };

  const handleAdd = (some_id) => {
    if (currentTab === 'templates') {
      if (templates.every((item) => item.isSelected === false || isChecked)) {
        let arr = templates.map((item) => {
          if (some_id == item._id) {
            item.isSelected = !item.isSelected;
          }
          return { ...item };
        });

        setTemplates(arr);
      }
    } else if (currentTab === 'products') {
      let arr = products.map((item) => {
        if (some_id == item._id) {
          item.isSelected = !item.isSelected;
        }
        return { ...item };
      });

      setProducts(arr);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.lower_container}>
        <div className={isChecked ? styles.upper_container_active : styles.upper_container_default}>
          {' '}
          {check()}
        </div>

        <p className={styles.lower_container__description}>{description}</p>
        <UnorderedList style={{ padding: '.5rem' }} spacing={1}>
          {features.map((feat, index) => {
            return <ListItem key={index}>{feat}</ListItem>;
          })}
        </UnorderedList>
      </div>

      <div className={styles.price_container}>
        <Heading as='h4' size='sm'>
          {price}
        </Heading>
      </div>
      <div className={styles.button_container}>
        <Button
          px='30px'
          borderRadius='15px'
          rightIcon={isChecked ? <FaCheck /> : null}
          size='sm'
          colorScheme='teal'
          variant='solid'
          onClick={() => {
            handleAdd(id);
          }}>
          {isChecked ? 'selected' : 'select'}
        </Button>
      </div>
    </div>
  );
};

export default Card;
