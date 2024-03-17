import { RootEntity } from "src/common/entity/root.entity";
import { Post } from "src/modules/post/entities/post.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Media extends RootEntity {
 
  @Column()
  url: string;

  @Column()
  type: 'image' | 'video';

  @ManyToOne(() => Post, (post) => post.media)
  post: Post;

}
