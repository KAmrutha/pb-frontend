import * as React from 'react';
import {
  Container,
  Box,
  chakra,
  Flex,
  Divider,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  useColorModeValue
} from '@chakra-ui/react';


const networks= [
  {
    name: 'Instagram',
    visitors: '3,550',
    visitorsRatio: '70%'
  },
  {
    name: 'Twitter',
    visitors: '1,229',
    visitorsRatio: '50%'
  },
  {
    name: 'Facebook',
    visitors: '1,115',
    visitorsRatio: '40%'
  }
];

const MediaTraffic = () => {
  const bg = useColorModeValue('gray.300', 'gray.600');
  const bgBar = 'blue.400';

  return (
    <Container maxW="3xl" py={10} px={4}>
      <Box border="1px solid" borderColor="gray.400" rounded="md" boxShadow="lg" overflow="hidden">
        <Flex justifyContent="left" p={5}>
          <chakra.h3 fontSize="xl" fontWeight="bold" textAlign="center">
            Social Media Traffic
          </chakra.h3>
        </Flex>
        <Divider />
        <TableContainer>
          <Table size="md">
            <Thead>
              <Tr fontWeight="900">
                <Th>Network</Th>
                <Th>Visitors</Th>
                <Th>New Users Rate</Th>
              </Tr>
            </Thead>
            <Tbody>
              {networks.map((network, index) => (
                <Tr key={index}>
                  <Td fontSize="sm">{network.name}</Td>
                  <Td fontSize="sm">{network.visitors}</Td>
                  <Td>
                    <Box w="100%" bg={bg} rounded="md">
                      <Box w={network.visitorsRatio} h={2} bg={bgBar} rounded="md"></Box>
                    </Box>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default MediaTraffic;
