import { RootEntity } from "src/common/entity/root.entity"
import { UserRole } from "src/common/enum/user.role.enum"
import { Entity, Column } from "typeorm"

@Entity()
export class User extends RootEntity {

    @Column({ nullable: true })
    username: string

    @Column({ nullable: true })
    firstname: string

    @Column({ nullable: true })
    lastname: string

    @Column({ nullable: true })
    phone: number

    @Column({ unique: true })
    email: string

    @Column({ enum: UserRole, type: 'enum', default: UserRole.User })
    role: UserRole

    @Column({ nullable: true })
    password: string

    @Column({ nullable: true })
    token: string

    @Column({ nullable: true })
    otp: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    otpCreatedAt: Date;

    @Column({ type: 'varchar', nullable: true })
    resetPasswordToken: string;

    @Column({ type: 'timestamp', nullable: true })
    resetPasswordExpires: Date;

}