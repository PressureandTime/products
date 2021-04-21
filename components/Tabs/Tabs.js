import { useState, useEffect, useContext } from 'react';
import {
  Button,
  Divider,
  Stack,
  List,
  ListItem,
  Badge,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';

import { FaLongArrowAltRight } from 'react-icons/fa';
import { useRouter } from 'next/router';
import styles from './Tabs.module.css';

import { slugify } from '../../utils/slugify';
import { TabContext } from '../../pages';

const Tabs = ({ children, initialTab, templates, products, setTemplates }) => {
  const { value, value2 } = useContext(TabContext);
  const [activeTab, setActiveTab] = useState(children[0].props.label);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [currentTab, setCurrentTab] = value;

  const [productsNum, setProductsNum] = value2;

  const router = useRouter();

  const [incrementedTemplates, setIncrementedTemplates] = useState(0);

  const [incrementedProducts, setIncrementedProducts] = useState(0);

  const handleClick = (e, newActiveTab) => {
    e.preventDefault();
    setActiveTab(slugify(newActiveTab));
    setCurrentTab(slugify(newActiveTab));
  };

  useEffect(() => {
    if (initialTab?.tab) {
      setActiveTab(initialTab.tab);
      setCurrentTab(initialTab.tab);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'templates' && templates.some((item) => item.isSelected === true)) {
      products.forEach((item) => (item.isSelected = false));
      setProductsNum(0);
    } else if (activeTab === 'products' && products.some((item) => item.isSelected === true)) {
      templates.forEach((item) => (item.isSelected = false));
      setIncrementedTemplates(0);
    }
  }, [templates, products, activeTab]);

  useEffect(() => {
    router.push(`${router.pathname}?tab=${slugify(activeTab)}`, undefined, {
      shallow: true,
    });
  }, [activeTab]);

  useEffect(() => {
    const checkIfSelected = () => {
      if (activeTab === 'templates') {
        templates.every((item) => item.isSelected === false)
          ? setButtonDisabled(true)
          : setButtonDisabled(false);
      } else if (activeTab === 'products') {
        products.every((item) => item.isSelected === false)
          ? setButtonDisabled(true)
          : setButtonDisabled(false);
      }
    };

    checkIfSelected();
  }, [products, templates, activeTab]);

  const renderSelectedOptions = () => {
    if (activeTab === 'templates') {
      return templates.map((item) => {
        if (item.isSelected === true) {
          return (
            <List key={item._id}>
              <ListItem>{item.name}</ListItem>
              <ListItem>{item.description}</ListItem>
              {item.features.map((feat, idx) => (
                <p key={idx}>{feat}</p>
              ))}
              <ListItem>{item.price}</ListItem>
            </List>
          );
        }
      });
    } else if (activeTab === 'products') {
      return products.map((item) => {
        if (item.isSelected === true) {
          return (
            <List key={item._id} style={{ paddingTop: '1rem' }}>
              <ListItem>{item.name}</ListItem>
              <ListItem>{item.description}</ListItem>
              {item.features.map((feat, idx) => (
                <p key={idx}>{feat}</p>
              ))}
              <ListItem>{item.price}</ListItem>
            </List>
          );
        }
      });
    }
  };

  useEffect(() => {
    if (templates.some((item) => item.isSelected === true)) {
      setIncrementedTemplates(1);
    } else {
      setIncrementedTemplates(0);
    }
  }, [templates, incrementedTemplates]);

  useEffect(() => {
    const found = products.filter((item) => item.isSelected === true);
    setIncrementedProducts(found.length);
    setProductsNum(found.length);
  }, [products]);

  const checkIncrement = () => {
    return productsNum;
  };

  return (
    <div>
      <Heading size='md'>Manage Subscription</Heading>
      <div className={styles.tab_container}>
        <Badge fontSize='1em' colorScheme='teal' variant='solid'>
          {checkIncrement()}
        </Badge>

        <ul className={styles.tabs}>
          {children.map((tab) => {
            const label = tab.props.label;

            return (
              <li className={slugify(label) == activeTab ? styles.current : ''} key={label}>
                <a href='#' onClick={(e) => handleClick(e, label)}>
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <Divider orientation='horizontal' variant='solid' p={1} />

      {children.map((one) => {
        if (slugify(one.props.label) == activeTab)
          return (
            <div key={one.props.label} className={styles.content}>
              {one.props.children}
            </div>
          );
      })}

      <div className={styles.button_group_next}>
        <Stack direction='row' spacing={4} align='center'>
          <Button
            onClick={onOpen}
            isDisabled={buttonDisabled}
            rightIcon={<FaLongArrowAltRight />}
            colorScheme='teal'>
            Next
          </Button>
          <Button colorScheme='teal' variant='link'>
            Back
          </Button>
        </Stack>
      </div>
      <Modal size='xl' isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{renderSelectedOptions()}</ModalBody>
          <ModalFooter>
            <Button colorScheme='teal' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Tabs;
