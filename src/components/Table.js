"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Text,
    Stack,
    Spinner,
    Flex,
  } from '@chakra-ui/react'
import { useRouter } from 'next/navigation';

export const PracticeTable = () => {
    const [questions, setQuestions] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchQuestions = async () => {
            const { data, error } = await supabase
                .from('Questions')
                .select();
            
            if (error) {
                console.error('Error fetching questions:', error);
            } else {
                setQuestions(data);
            }
        };

        fetchQuestions();
    }, []);

    if(questions.length === 0) {
        return (
            <Flex w='100vw' h='100vh' justify={'center'} align={'center'}>
                <Text fontSize={'2xl'} as={'b'} pr={'1rem'}>Loading</Text>
                <Spinner size="lg" thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" />
            </Flex>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Stack spacing={4} paddingInline={'10rem'} paddingBlock={'2rem'}>
                <Text fontSize={'2xl'} as={'b'}>
                    Practice Problems
                </Text>
                <TableContainer>
                    <Table variant='striped' colorScheme='black'>
                        <Thead>
                        <Tr>
                            <Th>Status</Th>
                            <Th>Question ID</Th>
                            <Th>Title</Th>
                            <Th>Difficulty</Th>
                            <Th>Rating</Th>
                        </Tr>
                        </Thead>
                        <Tbody>
                        {questions.map((question) => (
                            <Tr key={question.id} cursor={'pointer'} onClick={()=>{
                                router.push(`/practice/${question.id}`);
                            }}>
                                <Td>Not Attempted</Td>
                                <Td>{question.id}</Td>
                                <Td>{question.name}</Td>
                                <Td>LOL</Td>
                                <Td>1000</Td>
                            </Tr>
                        ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Stack>
        </div>
    );
};
