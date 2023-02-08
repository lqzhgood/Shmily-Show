import { DEFAULT_AVATAR_COME, DEFAULT_AVATAR_GO } from '@/views/Statistic/const.js';
export default {
    data: () => ({
        DEFAULT_AVATAR_COME,
        DEFAULT_AVATAR_GO,
    }),
    props: {
        unit: String,
        effect: { type: String, default: 'light' },
    },
};
