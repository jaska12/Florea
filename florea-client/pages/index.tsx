import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import PopularProducts from '../libs/components/homepage/PopularProducts';
import TopAgents from '../libs/components/homepage/TopAgents';
import Events from '../libs/components/homepage/Events';
import TrendProducts from '../libs/components/homepage/TrendProducts';
import TopProducts from '../libs/components/homepage/TopProducts';
import { Container, Stack } from '@mui/material';
import Advertisement from '../libs/components/homepage/Advertisement';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useReactiveVar } from '@apollo/client';
import { groupVar } from '../apollo/store';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();
	const group = useReactiveVar(groupVar);

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<TrendProducts />
				<PopularProducts />
				<Advertisement />
				<TopProducts />
				<TopAgents />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<Container>HELLO: {group}</Container>
				<TrendProducts />
				<PopularProducts />
				<Advertisement />
				<TopProducts />
				<TopAgents />
				<Events />
				<CommunityBoards />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
