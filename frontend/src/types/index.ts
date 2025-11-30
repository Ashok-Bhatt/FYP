import { User as SharedUser } from '../../../shared/types';

export * from '../../../shared/types';

// Extend Shared User to include token for Frontend state
export interface User extends SharedUser {
    token?: string;
}
