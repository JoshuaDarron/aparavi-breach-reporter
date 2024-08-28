// Modules
import knex from '../../db/db';
// Types
import { Report } from './types';
// Libs
import OpenAI from '../../lib/openAI';
// Class representing Reports
class Reports {
    async findOne (reportId: string): Promise<any> {
        const [report] = await knex('reports')
            .select('id', 'content', 'title')
            .where({ id: reportId });
        return report;
    }

    async find (): Promise<any> {
        const reports = await knex('reports')
            .select('id', 'content', 'title');
        return reports;
    }

    async create (report: Report): Promise<any> {
        const [res] = await knex('reports')
            .insert(report)
            .returning('*');
        return res;
    }

    async update (id: string, report: Report): Promise<any> {
        const [res] = await knex('reports')
            .update(report)
            .where('id', id)
            .returning('*');
        return res;
    }

    async delete (reportId: string): Promise<any> {
        const deleted = await knex('reports')
            .where('id', reportId)
            .del();
        return deleted;
    }

    async generateReport (data: any, token: string): Promise<any> {
        console.log(token);
        const { title, content } = data;
        const message = `${title} By: ${content}`;
        // Make a request to the OpenAI API
        const report = await OpenAI.chat(message);
        // Create report in db
        const dbReport = await this.create({
            title,
            content: report
        });
        // Return saved record
        return dbReport;
    }
}
// Expose Reports Class
export default new Reports();
