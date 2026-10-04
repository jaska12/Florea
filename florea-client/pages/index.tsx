import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import PopularProperties from '../libs/components/homepage/PopularProperties';
import TopAgents from '../libs/components/homepage/TopAgents';
import Events from '../libs/components/homepage/Events';
import TrendProperties from '../libs/components/homepage/TrendProperties';
import TopProperties from '../libs/components/homepage/TopProperties';
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
				<TrendProperties />
				<PopularProperties />
				<Advertisement />
				<TopProperties />
				<TopAgents />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<Container>HELLO: {group}</Container>
				<TrendProperties />
				<PopularProperties />
				<Advertisement />
				<TopProperties />
				<TopAgents />
				<Events />
				<CommunityBoards />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
