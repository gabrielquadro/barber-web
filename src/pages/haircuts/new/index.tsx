import { useState, useEffect } from 'react';
import Head from 'next/head';
import { SideBar } from '@/src/components/SideBar';
import {
    Flex,
    Text,
    Heading,
    Button,
    Stack,
    Switch,
    useMediaQuery,
    Input
} from '@chakra-ui/react'
import Router from 'next/router';
import Link from 'next/link';

import { FiArrowLeft } from 'react-icons/fi'
import { api } from "@/src/services/apiClient";
import { canSSRAuth } from "@/src/utils/canSSRAuth";
import { setupAPIClient } from '../../../services/api'

interface NewHaircutProps {
    subscription: boolean,
    count: number
}

export default function NewHaircut({ subscription, count }) {

    const [isMobile] = useMediaQuery("(max-width: 500px)")
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    async function handleRegister() {
        if (name === '' || price === '') {
            return;
        }

        try {
            const apiClient = setupAPIClient();
            await apiClient.post('/haircut', {
                name: name,
                price: Number(price),
            })

            Router.push('/haircuts')

        } catch (err) {
            console.log(err)
            alert('Erro ao cadastra modelo')
        }
    }

    return (
        <>
            <Head>
                <title>Novo modelo de corte - Minha barbearia</title>
            </Head>
            <SideBar>
                <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">
                    <Flex
                        direction={isMobile ? 'column' : 'row'}
                        w="100%"
                        align={isMobile ? 'flex-start' : 'center'}
                        mb={isMobile ? 4 : 0}
                    >

                        <Link href="/haircuts">
                            <Button
                                p={4}
                                display='flex'
                                alignItems='center'
                                justifyContent='center'
                                mr={4}
                                bgColor='barber.400'
                                color='white'
                            >
                                <FiArrowLeft size={24} color="white" />
                                Voltar
                            </Button>
                        </Link>

                        <Heading
                            fontSize={isMobile ? '28px' : "3xl"}
                            mt={4}
                            mb={4}
                            mr={4}
                            color="orange.900"
                        >
                            Novo modelo de corte
                        </Heading>
                    </Flex>

                    <Flex
                        direction='column'
                        maxW='700px'
                        bg='barber.400'
                        width="100%"
                        alignItems='center'
                        justifyContent='center'
                        pt={8}
                        pb={8}
                    >
                        <Heading
                            fontSize={isMobile ? '22px' : "3xl"}
                            color="white"
                            mb={4}
                        >
                            Cadastrar modelo de corte
                        </Heading>

                        <Input
                            placeholder='Nome do corte'
                            size='lg'
                            type='text'
                            w='85%'
                            bg='gray.900'
                            mb={4}
                            color='white'

                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        >
                        </Input>

                        <Input
                            placeholder='Valor do corte'
                            size='lg'
                            type='text'
                            w='85%'
                            bg='gray.900'
                            mb={4}
                            value={price}
                            color='white'
                            onChange={(e) => setPrice(e.target.value)}
                        >
                        </Input>

                        <Button
                            size='lg'
                            w='85%'
                            bg='button.cta'
                            disabled={!subscription && count >= 5}
                            onClick={handleRegister}
                        >
                            Cadastrar
                        </Button>

                        {!subscription && count >= 5 && (
                            <Flex
                                mt={4}
                                direction='row'
                                alignItems='center'
                                justifyContent='center'
                            >
                                <Text color='white'>Você atingiu seu limite de cortes.</Text>
                                <Link href='/planos'>
                                    <Text cursor='pointer' fontWeight='bold' ml={1} color='#31fb6a'>Seja premium.</Text>
                                </Link>
                            </Flex>
                        )}

                    </Flex>
                </Flex>

            </SideBar >
        </>
    )
}


//rota protegida
export const getServerSideProps = canSSRAuth(async (ctx) => {
    try {
        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/check');
        const count = await apiClient.get('/haircut/count');

        console.log('Subscription: ', response.data?.subscriptions);
        console.log('Count: ', count.data);

        const subscription = response.data?.subscriptions === null ? false : (response.data?.subscriptions.status === 'active');

        return {
            props: {
                subscription: subscription,
                count: count.data
            }
        };
    } catch (err) {
        console.log(err);
        console.log('An error occurred');
        return {
            redirect: {
                destination: '/dashboard',
                permanent: false
            }
        };
    }
});