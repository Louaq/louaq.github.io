import type { AstroIntegration } from 'astro';
import { searchClient } from '@algolia/client-search';
import { readFile } from 'node:fs/promises';

/**
 * Algolia 集成
 * 在构建完成后自动将索引上传到 Algolia
 */
export default function algolia(): AstroIntegration {
  return {
    name: 'algolia',
    hooks: {
      'astro:build:done': async ({ logger, dir }) => {
        // 从环境变量读取 Algolia 配置 (在钩子内读取以确保获取最新值)
        const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
        const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY;
        const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME || 'blog';

        // 如果未配置 Algolia 凭证,跳过上传
        if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_KEY) {
          logger.warn('Algolia credentials not configured. Skipping index upload.');
          logger.info('Please set ALGOLIA_APP_ID and ALGOLIA_ADMIN_KEY environment variables.');
          return;
        }

        try {
          const client = searchClient(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
          
          // 读取生成的 JSON 文件
          const path = new URL('./algolia.json', dir);
          logger.info(`Reading data from: ${path.pathname}`);
          
          const data = await readFile(path, 'utf-8');
          if (!data) {
            throw new Error('No data found in algolia.json');
          }

          const records = JSON.parse(data);
          if (!Array.isArray(records)) {
            throw new Error('Invalid data format: expected an array');
          }

          logger.info(`Found ${records.length} records to upload`);

          // 上传数据到 Algolia
          await client.saveObjects({ 
            indexName: ALGOLIA_INDEX_NAME, 
            objects: records 
          });

          logger.info(`✓ Successfully uploaded ${records.length} records to Algolia index: ${ALGOLIA_INDEX_NAME}`);
        } catch (error) {
          logger.error(`✗ Error uploading to Algolia: ${error instanceof Error ? error.message : String(error)}`);
          // 不要让构建失败,只记录错误
        }
      }
    }
  };
}
