import Thought from '../models/Thought.js'
import User from '../models/User.js'
import fs from 'fs'

import { Op } from 'sequelize';

export default class ThoughtController {
    static async showThoughts(req, res) {

        let search = '';
        search = req.query.search ? req.query.search : '';

        let order = 'DESC';

        if (req.query.order === 'old') {
            order = 'ASC'
        } else {
            order = 'DESC'
        }

        const thoughtsData = await Thought.findAll({
            include: User,
            where: {
                title: { [Op.like]: `%${search}%` }
            },
            order: [['createdAt', order]]
        });

        const thoughts = (await thoughtsData).map((result) => result.get({ plain: true }))

        // fs.writeFile("C:\\projects\\nodejs\\debugProjeto06.json", JSON.stringify(thoughts), function (erro) {
        //     if (erro) {
        //         throw erro;
        //     }

        //     console.log("Arquivo salvo");
        // });

        let thoughtsQty = thoughts.length;

        if (thoughtsQty === 0) {
            thoughtsQty = false;
        } 

        res.render('thoughts/home', { thoughts, search, thoughtsQty })
    }

    static async dashboard(req, res) {
        const userId = req.session.userid

        const user = await User.findOne({
            where: { id: userId },
            include: Thought,
            plain: true
        })

        if (!user) {
            res.redirect('/login')
        }

        const thoughts = user.Thoughts.map((result) => result.dataValues)

        let emptyThoughts = false;

        emptyThoughts = (thoughts.length === 0) ? true : false;

        res.render('thoughts/dashboard', { thoughts, emptyThoughts })
    }

    static createThought(req, res) {
        res.render('thoughts/create')
    }


    static async createThoughtSave(req, res) {
        const thought = {
            title: req.body.title,
            UserId: req.session.userid,
        }

        await Thought.create(thought)


        try {
            req.flash('message', 'Pensamento criado com sucesso!')

            req.session.save(() => {
                res.redirect('/thoughts/dashboard')
            })
        } catch (error) {
            console.log(error);
        }
    }

    static async removeThought(req, res) {
        const id = req.body.id;
        const UserId = req.session.userid

        try {
            await Thought.destroy({ where: { id: id, UserId: UserId } })

            req.flash('message', 'Pensamento removido com sucesso!')

            req.session.save(() => {
                res.redirect('/thoughts/dashboard')
            })
        } catch (error) {
            console.log(error);
        }



    }

    static async updateThought(req, res) {
        const id = req.params.id;

        const thought = await Thought.findOne({ where: { id: id }, raw: true })

        res.render('thoughts/edit', { thought })
    }

    static async updateThoughtSave(req, res) {
        const id = req.body.id;

        const thought = {
            title: req.body.title,
        }

        try {
            await Thought.update(thought, { where: { id: id } })

            req.flash('message', 'Pensamento atualizado com sucesso!')

            res.redirect('/thoughts/dashboard')
        } catch (error) {
            console.log(error);
        }


    }
}