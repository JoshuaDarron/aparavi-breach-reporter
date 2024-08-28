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

    async generateReport (data: any): Promise<any> {
        const { title, content } = data;
        const message = JSON.stringify(content);
        // Make a request to the OpenAI API
        const report = await OpenAI.chat(`
            I'm going to give you an object of key value pairs where the keys are the names of Sensitive Data Types.
            You are to create a summary of the data in the below format.

            When reporting on sensitive data respond with a JSON object with the following fields
            - content: string

            If you can't come up with a report, respond in the same JSON format.
            Use the content property to output your response.

            make sure you add some \n and format for raw html text.

            Report Requirements:

            The report should always include the following sections:

            1. Summary of the Breach (At least 3 sentences)
            Briefly describe the incident and the total number of compromised files.
            2. Details of Compromised Files (Always do bullets)
            Provide a breakdown of the number and type of sensitive information compromised.
            Describe the potential risk associated with each type of sensitive information.
            3. Impact Assessment (At least 5 sentences)
            Assess the potential impact of the breach on affected individuals based on the type of information compromised.
            4. Recommended Actions (At least 4 actions, and always do bullets)
            Suggest immediate steps to mitigate the impact of the breach.
            Provide recommendations for improving security and preventing future incidents.
            5. Conclusion (At least 5 sentences)
            Summarize the overall impact of the breach and the importance of the recommended actions.
            Important: The response should only include the structured report as requested above, with no additional commentary or information.
            
            Take the json object below and use the values for the details of compromised files section. Also do
            not return a bullet with nothing.
            ${message}
        `);
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
