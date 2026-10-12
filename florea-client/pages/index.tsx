import { NextPage } from 'next';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import PopularProducts from '../libs/components/homepage/PopularProducts';
import TopAgents from '../libs/components/homepage/TopAgents';
import TrendProducts from '../libs/components/homepage/TrendProducts';
import TopProducts from '../libs/components/homepage/TopProducts';
import CategoryTiles from '../libs/components/homepage/CategoryTiles';
import OccasionTiles from '../libs/components/homepage/OccasionTiles';
import SameDayFeature from '../libs/components/homepage/SameDayFeature';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	// One layout for every screen size; the stylesheet (scss/home/home.scss) adapts it.
	return (
		<div className={'florea-home'}>
			<OccasionTiles />
			<TrendProducts />
			<PopularProducts />
			<CategoryTiles />
			<SameDayFeature />
			<TopProducts />
			<TopAgents />
			<CommunityBoards />
		</div>
	);
};

export default withLayoutMain(Home);
