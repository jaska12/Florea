import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import PopularProducts from '../libs/components/homepage/PopularProducts';
import TopAgents from '../libs/components/homepage/TopAgents';
import TrendProducts from '../libs/components/homepage/TrendProducts';
import TopProducts from '../libs/components/homepage/TopProducts';
import CategoryTiles from '../libs/components/homepage/CategoryTiles';
import BrandBand from '../libs/components/homepage/BrandBand';
import FiberContainer from '../libs/components/common/FiberContainer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	// One layout for every screen size; the stylesheet (scss/home/home.scss) adapts it.
	return (
		<div className={'florea-home'}>
			<CategoryTiles />
			<TrendProducts />
			<PopularProducts />
			{/* the three.js gallery needs a pointer and a wide screen, so phones skip it */}
			{device !== 'mobile' && (
				<section className={'home-gallery'} aria-hidden="true">
					<FiberContainer />
				</section>
			)}
			<BrandBand />
			<TopProducts />
			<TopAgents />
			<CommunityBoards />
		</div>
	);
};

export default withLayoutMain(Home);
