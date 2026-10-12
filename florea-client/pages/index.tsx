import { NextPage } from 'next';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import ShopBy from '../libs/components/homepage/ShopBy';
import Bestsellers from '../libs/components/homepage/Bestsellers';
import SameDayFeature from '../libs/components/homepage/SameDayFeature';
import TopAgents from '../libs/components/homepage/TopAgents';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	// One layout for every screen size; the stylesheet (scss/home/home.scss) adapts it.
	// Bestsellers, TopAgents and CommunityBoards leave themselves out when they have too little to show.
	return (
		<div className={'florea-home'}>
			<ShopBy />
			<Bestsellers />
			<SameDayFeature />
			<TopAgents />
			<CommunityBoards />
		</div>
	);
};

export default withLayoutMain(Home);
