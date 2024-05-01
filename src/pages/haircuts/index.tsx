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
    useMediaQuery
} from '@chakra-ui/react'

import Link from 'next/link';

import { IoMdPricetag } from 'react-icons/io'
import { canSSRAuth } from "@/src/utils/canSSRAuth";
import { setupAPIClient } from '../../services/api'

interface HaircutsItemProps {
    id: string,
    name: string,
    price: number | string,
    status: boolean,
    user_id: string
}


interface HaircutsProps {
    haircuts: HaircutsItemProps[]
}


export default function Haircuts({ haircuts }: HaircutsProps) {

    const [isMobile] = useMediaQuery("(max-width: 500px)")
    const [haircutsList, setHaircutsList] = useState(haircuts || [])
    return (
        <>
            <Head>
                <title>Modelos de corte - Minha barbearia</title>
            </Head>
            <SideBar>
                <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">
                    <Flex
                        direction={isMobile ? 'column' : 'row'}
                        w="100%"
                        alignItems={isMobile ? 'flex-start' : 'center'}
                        justifyContent="flex-start"
                        mb={0}
                    >
                        <Heading
                            fontSize={isMobile ? '28px' : "3xl"}
                            mt={4}
                            mb={4}
                            mr={4}
                            color="orange.900"
                        >
                            Modelos de corte
                        </Heading>

                        <Link href="/haircuts/new">
                            <Button>
                                Cadastrar novo
                            </Button>
                        </Link>

                        <Stack ml="auto" align="center" direction="row">
                            <Text color='white' fontWeight="bold">ATIVOS</Text>
                            <Switch
                                colorScheme="green"
                                size="lg"
                            />
                        </Stack>
                    </Flex>


                    {haircutsList.map(haircut => (
                        <Link
                            key={haircut.id}
                            href={`/haircuts/${haircut.id}`}
                            style={{ width: '100%' }}>
                            <Flex
                                cursor="pointer"
                                w="100%"
                                p={4}
                                bg="barber.400"
                                direction={isMobile ? "column" : "row"}
                                rounded="4"
                                mb={2}
                                justifyContent="space-between"
                                align={isMobile ? "flex-start" : "center"}
                            >
                                <Flex
                                    direction="row"
                                    alignItems="center"
                                    mb={isMobile ? 2 : 0}
                                >
                                    <IoMdPricetag size={28} color="#fba931" />
                                    <Text fontWeight="bold" ml={4} noOfLines={2} color="white">
                                        {haircut.name}
                                    </Text>
                                </Flex>

                                <Text fontWeight="bold" color="white">
                                    Preço: R${haircut.price}
                                </Text>
                            </Flex>
                        </Link>
                    ))}

                </Flex>

            </SideBar>
        </>
    )
}

//rota protegida
export const getServerSideProps = canSSRAuth(async (ctx) => {
    try {
        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/haircuts',
            {
                params: {
                    status: true
                }
            }
        );

        if (response.data == null) {
            return {
                redirect: {
                    destination: '/dashboard',
                    permanent: false
                }
            };
        }

        return {
            props: {
                haircuts: response.data
            }
        };
    } catch (err) {
        console.log(err);
        return {
            redirect: {
                destination: '/dashboard',
                permanent: false
            }
        };
    }
});
