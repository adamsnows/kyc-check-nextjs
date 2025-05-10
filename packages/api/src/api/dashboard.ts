import express, { Request, Response, Router } from 'express';
import Validation from '../models/Validation';

const router: Router = express.Router();

// Buscar estatísticas de validações
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const totalCount = await Validation.countDocuments();
    const matchCount = await Validation.countDocuments({ isMatch: true });
    const notMatchCount = await Validation.countDocuments({ isMatch: false });
    const averageSimilarity = await Validation.aggregate([
      { $match: { similarity: { $exists: true } } },
      { $group: { _id: null, average: { $avg: "$similarity" } } }
    ]);

    // Estatísticas dos últimos 7 dias
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyStats = await Validation.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { 
        $group: {
          _id: { 
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 },
          matches: { $sum: { $cond: [{ $eq: ["$isMatch", true] }, 1, 0] } },
          notMatches: { $sum: { $cond: [{ $eq: ["$isMatch", false] }, 1, 0] } },
          avgSimilarity: { $avg: "$similarity" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalValidations: totalCount,
        matchValidations: matchCount,
        notMatchValidations: notMatchCount,
        matchRate: totalCount > 0 ? (matchCount / totalCount) * 100 : 0,
        averageSimilarity: averageSimilarity.length > 0 ? averageSimilarity[0].average : 0,
        dailyStats
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas do dashboard'
    });
  }
});

// Listar histórico de validações com paginação
router.get('/history', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const validations = await Validation.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-imageHashes'); // Não enviar hashes de imagem por questões de segurança

    const total = await Validation.countDocuments();

    res.json({
      success: true,
      data: {
        validations,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching validation history:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar histórico de validações'
    });
  }
});

export default router;
