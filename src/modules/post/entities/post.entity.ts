import { RootEntity } from "src/common/entity/root.entity";
import { Media } from "src/modules/media/entities/media.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Post extends RootEntity {

    @Column()
    titleUz: string

    @Column()
    titleRu: string

    @Column()
    descriptionUz: string

    @Column()
    descriptionRu: string

    @Column({ default: 0 })
    views: number;
    
    @Column()
    author: string

    @OneToMany(() => Media, (media) => media.post)
    media: Media[];
}
