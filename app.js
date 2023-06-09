import {Router} from '@ulibs/router'
import { PluginManager } from '@ulibs/plugin'
import { connect } from '@ulibs/db'


function Quiz() {
    return {
        async onStart(ctx) {
            console.log('start plugin', ctx)

            const Users = ctx.getModel('users')
            const Questions = ctx.getModel('questions')
            const Answers = ctx.getModel('answers')
            const Roles = ctx.getModel('roles')
            const Submissions = ctx.getModel('submissions')

            await Users.insert({
                name: 'Admin', 
                password: '1qaz!QAZ', 
                email: 'admin@quiz.com', 
                username: 'admin'
            })

            await Questions.insert({
                title: 'What is 2 + 2',
                created_by: 1,
                answers: {
                    add: [
                        {value: '3', is_correct: false},
                        {value: '4', is_correct: true},
                        {value: '5', is_correct: false},
                        {value: '2', is_correct: false},
                    ]
                }
            })

            console.log(await Users.query())
            console.log(await Questions.query())
        },

        async onInstall(ctx) {
            await ctx.createTable('users', {
                name: 'string|required',
                email: 'string',
                username: 'string|required',
                password: 'string|required'
            });

            await ctx.createTable('questions', {
                title: 'string|required',
                created_by: 'users',
                answers: 'answer[]'
            })

            await ctx.createTable('answers', {
                value: 'string|required',
                question: 'questions',
                is_correct: 'boolean|required|default=false',                
            })

            await ctx.createTable('roles', {
                name: 'string|required',
                description: 'string',
                users: 'user[]'
            })

            await ctx.createTable('submissions', {
                user: 'user',
                answer: 'answer'
            })
        },
        async onRemove(ctx) {
            await ctx.removeTable('users');
            await ctx.removeTable('roles');
            await ctx.removeTable('questions');
            await ctx.removeTable('answers');
            await ctx.removeTable('submissions');
        }
    }
}


const {createTable, getModel, removeTable} = connect({client: 'sqlite3', filename: './cms.db'})

const pm = PluginManager({
    config: './plugins.json',
    ctx: {
        createTable,
        removeTable,
        getModel,
        installPlugin,
        removePlugin
    }
})

function installPlugin(name, methods) {
    return pm.install(name, methods)
}

function removePlugin(name) {

    return pm.remove(name)
}

// await removeTable('users')

await installPlugin('quiz', Quiz())

// console.log('before remove')
// await removePlugin('quiz');
// console.log('after remove')


pm.start()

