import Head from "next/head";
import { Flex, Text } from "@chakra-ui/react";
import { canSSRAuth } from "@/src/utils/canSSRAuth";
import { SideBar } from "@/src/components/SideBar";

export default function Dashboard() {
    return (
        <>
            <Head>
                <title>BarebrPro - Minha barbearia</title>
            </Head>
            <SideBar>
                <Flex background="barber.900" height="100vh" alignItems="center" justifyContent="center">
                    <Text>Bem vindo ao dashboard</Text>
                </Flex>
            </SideBar>
        </>
    )
}

//rota protegida
export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {

        }
    }
})