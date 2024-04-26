import { useState, useContext } from "react";
import Head from "next/head";
import { Flex, Text, Heading, Box, Input, Button } from "@chakra-ui/react";
import { canSSRAuth } from "@/src/utils/canSSRAuth";
import { SideBar } from "@/src/components/SideBar";
import Link from "next/link";
import { AuthContext } from "@/src/context/AuthContext";
import { setupAPIClient } from '../../services/api'
import { api } from "@/src/services/apiClient";

interface UserProfileprops {
    id: string,
    name: string,
    email: string,
    endereco: string | null,
}

interface Profileprops {
    user: UserProfileprops,
    premium: boolean
}

export default function Profile({ user, premium }: Profileprops) {

    const { logoutUser } = useContext(AuthContext);
    const [name, setName] = useState(user && user?.name)
    const [enddereco, setEnddereco] = useState(user && user?.endereco)

    async function handleLogout() {
        await logoutUser();
    }

    async function handleUpdateUser() {
        if (name === '') {
            return;
        }

        try {
            const apiClient = setupAPIClient();
            await apiClient.put('/user', {
                name: name,
                endereco: enddereco
            })
            alert('Dados alterados com sucesso!')
        } catch (err) {
            console.log('Erro ao salvar.', err);
        }

    }

    return (
        <>
            <Head>
                <title>BarebrPro - Minha conta</title>
            </Head>
            <SideBar>
                <Flex
                    background="barber.900"
                    // height="100vh"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    direction='column'
                >
                    <Flex
                        w='100%'
                        direction='row'
                        alignItems="center"
                        justifyContent="flex-start"
                    >
                        <Heading
                            fontSize='3xl'
                            color='orange.900'
                            mt={4}
                            mb={4}
                            mr={4}
                        >Minha conta</Heading>
                    </Flex>

                    <Flex
                        maxWidth='700px'
                        w='100%'
                        alignItems="center"
                        justifyContent="center"
                        direction='column'
                        bg='barber.400'
                        pt={8}
                        pb={8}
                    >
                        <Flex w='85%' direction='column'>
                            <Text
                                mb={2}
                                fontSize='xl'
                                color='white'
                                fontWeight='bold'
                            >Nome</Text>
                            <Input
                                w='100%'
                                bg='gray.900'
                                placeholder='Nome da barbearia'
                                size='lg'
                                type='text'
                                mb={4}
                                color='white'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <Text
                                mb={2}
                                fontSize='xl'
                                color='white'
                                fontWeight='bold'
                            >Endereço</Text>
                            <Input
                                w='100%'
                                bg='gray.900'
                                placeholder='Endereço da barbearia'
                                size='lg'
                                type='text'
                                mb={4}
                                color='white'
                                value={enddereco}
                                onChange={(e) => setEnddereco(e.target.value)}
                            />

                            <Text
                                mb={2}
                                fontSize='xl'
                                color='white'
                                fontWeight='bold'
                            >Plano atual</Text>

                            <Flex
                                direction="row"
                                w='100%'
                                mb={4}
                                p={1}
                                borderWidth={1}
                                rounded={6}
                                bg='barber.900'
                                alignItems='center'
                                justifyContent='space-between'
                            >
                                <Text
                                    p={2}
                                    fontSize='lg'
                                    color={premium ? '#fba931' : '#4dffb4'}
                                >
                                    Plano {premium ? 'Premium' : 'Grátis'}
                                </Text>

                                <Link
                                    href='/planos'
                                >
                                    <Box
                                        color='white'
                                        cursor='pointer'
                                        p={1}
                                        pl={2}
                                        pr={2}
                                        bg='#00cd52'
                                        rounded={4}
                                    >
                                        Mudar de plano
                                    </Box>
                                </Link>
                            </Flex>

                            <Button
                                w='100%'
                                mt={4}
                                mb={4}
                                bg='button.cta'
                                size='lg'
                                _hover={{ bg: '#ffb13e' }}
                                onClick={handleUpdateUser}
                            >
                                Salvar
                            </Button>

                            <Button
                                w='100%'
                                mb={6}
                                bg='transparent'
                                borderWidth={2}
                                borderColor='red.500'
                                color='red.500'
                                size='lg'
                                _hover={{ bg: 'transparent' }}
                                onClick={handleLogout}
                            >
                                Sair
                            </Button>
                        </Flex>
                    </Flex>
                </Flex>
            </SideBar>
        </>
    )
}

//rota protegida
export const getServerSideProps = canSSRAuth(async (ctx) => {
    try {
        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/me')

        if (response.data && response.data.user && response.data.user.id) {
            const user = {
                id: response.data.user.id,
                name: response.data.user.name,
                email: response.data.user.email,
                endereco: response.data.user.endereco,
            }

            return {
                props: {
                    user: user,
                    premium: response.data.user.subscriptions?.status === 'active' ? true : false
                }
            }
        } else {
            // Trate a situação em que não há dados de usuário ou o ID é indefinido
            console.log('Dados de usuário incompletos ou ausentes.')
            return {
                props: {
                    user: null,
                    premium: false
                }
            }
        }
    } catch (err) {
        console.log('Erro ao carregar informações do usuário:', err)
        return {
            props: {
                user: null,
                premium: false
            }
        }
    }
})