import { useTranslation } from 'next-i18next';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Stack, Box } from '@mui/material';
import moment from 'moment';

const Footer = () => {
	const { t } = useTranslation('common');

	return (
		<Stack className={'footer-container'}>
			<Stack className={'main'}>
				<Stack className={'left'}>
					<Box component={'div'} className={'footer-box'}>
						<img src="/img/logo/florea/florea-logo-on-dark.svg" alt="Florea" className={'logo'} />
					</Box>
					<Box component={'div'} className={'footer-box'}>
						<span>{t('footer.customerCare')}</span>
						<p>+82 10 4867 2909</p>
					</Box>
					<Box component={'div'} className={'footer-box'}>
						<span>{t('footer.needHelpWithAnOrder')}</span>
						<p>+82 10 4867 2909</p>
						<span>{t('footer.weReplyWithinADay')}</span>
					</Box>
					<Box component={'div'} className={'footer-box'}>
						<p>{t('footer.followUsOnSocialMedia')}</p>
						<div className={'media-box'}>
							<FacebookOutlinedIcon />
							<TelegramIcon />
							<InstagramIcon />
							<TwitterIcon />
						</div>
					</Box>
				</Stack>
				<Stack className={'right'}>
					<Box component={'div'} className={'top'}>
						<strong>{t('footer.seasonalBouquetsAndGiftIdeas')}</strong>
						<div>
							<input type="text" placeholder={t('footer.yourEmail')} />
							<span>{t('footer.subscribe')}</span>
						</div>
					</Box>
					<Box component={'div'} className={'bottom'}>
						<div>
							<strong>{t('footer.shop')}</strong>
							<span>{t('footer.sameDayDelivery')}</span>
							<span>{t('footer.giftWrappedItems')}</span>
						</div>
						<div>
							<strong>{t('footer.quickLinks')}</strong>
							<span>{t('footer.termsOfUse')}</span>
							<span>{t('footer.privacyPolicy')}</span>
							<span>{t('footer.deliveryInformation')}</span>
							<span>{t('footer.ourServices')}</span>
							<span>{t('footer.contactSupport')}</span>
							<span>{t('footer.faqs')}</span>
						</div>
						<div>
							<strong>{t('footer.deliveryAreas')}</strong>
							<span>{t('footer.seoul')}</span>
							<span>{t('footer.gyeongido')}</span>
							<span>{t('footer.busan')}</span>
							<span>{t('footer.jejudo')}</span>
						</div>
					</Box>
				</Stack>
			</Stack>
			<Stack className={'second'}>
				<span>© Florea - All rights reserved. Florea {moment().year()}</span>
				<span>{t('footer.privacyTermsSitemap')}</span>
			</Stack>
		</Stack>
	);
};

export default Footer;
