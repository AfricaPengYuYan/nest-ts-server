import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('sys_role_menu')
export class RoleMenuEntity {
    @PrimaryGeneratedColumn({comment: 'id', name: 'id', type: 'int'}) id: number;

    @Column({type: 'int', nullable: true, name: 'r_id', comment: '角色id'})
    rid: number;

    @Column({type: 'int', nullable: true, name: 'm_id', comment: '菜单id'})
    mid: number;
}
