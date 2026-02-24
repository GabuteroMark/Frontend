import { Role } from './role';
import { GradeLevel } from '@app/_models';

export class Account {
    id?: string;
    title?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    role?: Role;
    jwtToken?: string;
    manager?: Account; // Optional, if the user has a manager
    BranchId?: string;  // Ensure this is set correctly when the account is fetched
    GradeLevel?: GradeLevel;  // If the branch data itself is included in the account
}
