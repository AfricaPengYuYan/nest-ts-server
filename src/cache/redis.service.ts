import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis, { Cluster, Redis as RedisClient } from "ioredis";

@Injectable()
export class RedisService {
    private redisClient: Cluster | RedisClient;

    /**
     * 构造函数
     * @param {ConfigService} configService - 配置服务实例
     */
    constructor(private readonly configService: ConfigService) {
        this.initRedis();
    }

    /**
     * 初始化 Redis 客户端
     * @param {string} [connectType] - 连接类型，默认为单机连接，可选 'cluster' 表示集群连接
     */
    private async initRedis(connectType?: string): Promise<void> {
        if (!this.redisClient) {
            if (connectType && connectType === "cluster") {
                const cluster = new Redis.Cluster(this.configService.get("redis"));
                cluster.on("error", (err) => {
                    console.error("Redis cluster Error：" + err);
                });
                cluster.on("connect", () => {
                    console.info("redis连接成功");
                    this.redisClient = cluster;
                });
            } else {
                const redis = new Redis(this.configService.get("redis"));
                redis.on("error", (err) => {
                    console.error("Redis Error：" + err);
                });
                redis.on("connect", () => {
                    console.info("redis连接成功");
                    this.redisClient = redis;
                });
            }
        }
    }

    /**
     * 设置 Redis 键值对
     * @param {string} key - 键名
     * @param {any} value - 键值
     * @param {number} [expired] - 过期时间（秒），可选
     */
    public async set(key: string, value: any, expired?: number): Promise<void> {
        value = JSON.stringify(value);
        if (!expired) await this.redisClient.set(key, value);
        else {
            // @ts-ignore
            await this.redisClient.set(key, value, ["EX", expired]);
        }
    }

    /**
     * 获取 Redis 键对应的值
     * @param {string} key - 键名
     * @returns {Promise<any>} 返回键对应的值
     */
    public async get(key: string): Promise<any> {
        const data = await this.redisClient.get(key);
        if (data) return JSON.parse(data);
        return null;
    }

    /**
     * 获取 Redis 键的剩余生存时间（秒）
     * @param {string} key - 键名
     * @returns {Promise<number>} 返回剩余生存时间（秒）
     */
    public async ttl(key: string): Promise<number> {
        return await this.redisClient.ttl(key);
    }

    /**
     * 删除指定键
     * @param {string} key - 键名
     * @returns {Promise<number>} 返回删除的键的数量
     */
    public async del(key: string): Promise<number> {
        return await this.redisClient.del(key);
    }

    /**
     * 设置哈希字段的值
     * @param {string} key - 哈希键名
     * @param {string} field - 哈希字段名
     * @param {string} value - 字段值
     * @returns {Promise<string | number | null>} 返回设置结果，如果设置成功返回 OK，否则返回 null
     */
    async hset(key: string, field: string, value: string): Promise<string | number | null> {
        if (!key || !field) return null;
        return await this.redisClient.hset(key, field, value);
    }
}
