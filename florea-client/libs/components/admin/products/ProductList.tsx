import { useEnumLabel } from '../../../i18n/labels';
import { useTranslation } from 'next-i18next';
import React from 'react';
import Link from 'next/link';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Menu,
	Fade,
	MenuItem,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { Stack } from '@mui/material';
import { Product } from '../../../types/product/product';
import { REACT_APP_API_URL } from '../../../config';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { ProductStatus } from '../../../enums/product.enum';

interface Data {
	id: string;
	title: string;
	price: string;
	agent: string;
	location: string;
	type: string;
	status: string;
}

type Order = 'asc' | 'desc';

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id',
		numeric: true,
		disablePadding: false,
		label: 'products.table.id',
	},
	{
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'products.table.title',
	},
	{
		id: 'price',
		numeric: false,
		disablePadding: false,
		label: 'products.table.price',
	},
	{
		id: 'agent',
		numeric: false,
		disablePadding: false,
		label: 'products.table.florist',
	},
	{
		id: 'location',
		numeric: false,
		disablePadding: false,
		label: 'products.table.location',
	},
	{
		id: 'type',
		numeric: false,
		disablePadding: false,
		label: 'products.table.type',
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'products.table.status',
	},
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, product: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { t } = useTranslation('admin');
	const { onSelectAllClick } = props;

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
					>
						{t(headCell.label)}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface ProductPanelListType {
	products: Product[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateProductHandler: any;
	removeProductHandler: any;
}

export const ProductPanelList = (props: ProductPanelListType) => {
	const { t } = useTranslation('admin');
	const enumLabel = useEnumLabel();
	const {
		products,
		anchorEl,
		menuIconClickHandler,
		menuIconCloseHandler,
		updateProductHandler,
		removeProductHandler,
	} = props;

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					{/*@ts-ignore*/}
					<EnhancedTableHead />
					<TableBody>
						{products.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={8}>
									<span className={'no-data'}>{t('products.dataNotFound')}</span>
								</TableCell>
							</TableRow>
						)}

						{products.length !== 0 &&
							products.map((product: Product, index: number) => {
								const productImage = `${REACT_APP_API_URL}/${product?.productImages[0]}`;

								return (
									<TableRow hover key={product?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left">{product._id}</TableCell>
										<TableCell align="left" className={'name'}>
											{product.productStatus === ProductStatus.ACTIVE ? (
												<Stack direction={'row'}>
													<Link href={`/product/detail?id=${product?._id}`}>
														<div>
															<Avatar alt="Remy Sharp" src={productImage} sx={{ ml: '2px', mr: '10px' }} />
														</div>
													</Link>
													<Link href={`/product/detail?id=${product?._id}`}>
														<div>{product.productTitle}</div>
													</Link>
												</Stack>
											) : (
												<Stack direction={'row'}>
													<div>
														<Avatar alt="Remy Sharp" src={productImage} sx={{ ml: '2px', mr: '10px' }} />
													</div>
													<div style={{ marginTop: '10px' }}>{product.productTitle}</div>
												</Stack>
											)}
										</TableCell>
										<TableCell align="center">{product.productPrice}</TableCell>
										<TableCell align="center">{product.memberData?.memberNick}</TableCell>
										<TableCell align="center">{enumLabel('productLocation', product.productLocation)}</TableCell>
										<TableCell align="center">{enumLabel('productType', product.productType)}</TableCell>
										<TableCell align="center">
											{product.productStatus === ProductStatus.DELETE && (
												<Button
													variant="outlined"
													sx={{ p: '3px', border: 'none', ':hover': { border: '1px solid #000000' } }}
													onClick={() => removeProductHandler(product._id)}
												>
													<DeleteIcon fontSize="small" />
												</Button>
											)}

											{product.productStatus === ProductStatus.SOLD && (
												<Button className={'badge warning'}>{enumLabel('productStatus', product.productStatus)}</Button>
											)}

											{product.productStatus === ProductStatus.ACTIVE && (
												<>
													<Button onClick={(e: any) => menuIconClickHandler(e, index)} className={'badge success'}>
														{enumLabel('productStatus', product.productStatus)}
													</Button>

													<Menu
														className={'menu-modal'}
														MenuListProps={{
															'aria-labelledby': 'fade-button',
														}}
														anchorEl={anchorEl[index]}
														open={Boolean(anchorEl[index])}
														onClose={menuIconCloseHandler}
														TransitionComponent={Fade}
														sx={{ p: 1 }}
													>
														{Object.values(ProductStatus)
															.filter((ele) => ele !== product.productStatus)
															.map((status: string) => (
																<MenuItem
																	onClick={() => updateProductHandler({ _id: product._id, productStatus: status })}
																	key={status}
																>
																	<Typography variant={'subtitle1'} component={'span'}>
																		{enumLabel('productStatus', status)}
																	</Typography>
																</MenuItem>
															))}
													</Menu>
												</>
											)}
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
