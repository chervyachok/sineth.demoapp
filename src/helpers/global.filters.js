import dayjs from 'dayjs';
import { formatUnits } from 'viem'

export default {
	formatTimestamp(val) {
		if (!val) return '--';
		return dayjs(parseInt(val) * 1000).format('YYYY-MM-DD HH:mm:ss');
	},

	formatUnits(val, decimals = 18, fixed = 0) {		
		if (val === null || val === undefined) return '--';
		if (typeof val === 'string') val = BigInt(parseInt(val));
		
		let n = parseFloat(formatUnits(val, decimals)).toFixed(fixed) 
		return n	
	},
};
