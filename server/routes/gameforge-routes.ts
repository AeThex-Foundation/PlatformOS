/**
 * GameForge API Routes
 * Project, sprint, task, and team management for GameForge ARM
 */

import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../oauth/oauth-service';

const router = Router();

/**
 * GET /api/gameforge/projects
 * List all projects or get a single project by ID (requires auth)
 */
router.get('/projects', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const projectId = req.query.id as string;
    const status = req.query.status as string;
    const platform = req.query.platform as string;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    if (projectId) {
      const { data, error } = await supabaseAdmin
        .from('gameforge_projects')
        .select(`
          *,
          user_profiles!lead_id(id, full_name, avatar_url, username),
          gameforge_team_members(
            id, user_id, role, role_title, joined_at,
            user_profiles(id, full_name, avatar_url, username)
          )
        `)
        .eq('id', projectId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Project not found' });
        }
        throw error;
      }

      return res.json(data);
    }

    let dbQuery = supabaseAdmin
      .from('gameforge_projects')
      .select(`
        id,
        name,
        description,
        status,
        platform,
        genre,
        target_release_date,
        actual_release_date,
        team_size,
        budget,
        current_spend,
        created_at,
        lead_id,
        user_profiles!lead_id(id, full_name, avatar_url, username)
      `, { count: 'exact' });

    if (status) dbQuery = dbQuery.eq('status', status);
    if (platform) dbQuery = dbQuery.eq('platform', platform);

    const { data, error, count } = await dbQuery
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({
      data: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (err: any) {
    console.error('[GameForge Projects]', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/gameforge/projects
 * Create a new project (requires auth)
 */
router.post('/projects', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const {
      name,
      description,
      platform,
      genre,
      target_release_date,
      budget,
      repository_url,
      documentation_url,
    } = req.body;

    if (!name || !platform) {
      return res.status(400).json({ error: 'Missing required fields: name, platform' });
    }

    const { data, error } = await supabaseAdmin
      .from('gameforge_projects')
      .insert([{
        name,
        description,
        status: 'planning',
        lead_id: user.id,
        platform,
        genre: genre || [],
        target_release_date,
        budget,
        repository_url,
        documentation_url,
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err: any) {
    console.error('[GameForge Projects]', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/gameforge/projects/:id
 * Update a project (requires auth + project lead)
 */
router.put('/projects/:id', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;
    const { data: project } = await supabaseAdmin
      .from('gameforge_projects')
      .select('lead_id')
      .eq('id', id)
      .single();

    if (project?.lead_id !== user.id) {
      return res.status(403).json({ error: 'Only project lead can update' });
    }

    const {
      name,
      description,
      status,
      platform,
      genre,
      target_release_date,
      actual_release_date,
      budget,
      current_spend,
      repository_url,
      documentation_url,
    } = req.body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (platform !== undefined) updateData.platform = platform;
    if (genre !== undefined) updateData.genre = genre;
    if (target_release_date !== undefined) updateData.target_release_date = target_release_date;
    if (actual_release_date !== undefined) updateData.actual_release_date = actual_release_date;
    if (budget !== undefined) updateData.budget = budget;
    if (current_spend !== undefined) updateData.current_spend = current_spend;
    if (repository_url !== undefined) updateData.repository_url = repository_url;
    if (documentation_url !== undefined) updateData.documentation_url = documentation_url;

    const { data, error } = await supabaseAdmin
      .from('gameforge_projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    console.error('[GameForge Projects]', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/gameforge/sprint
 * Get current active sprint for user
 */
router.get('/sprint', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { data: sprintMembership } = await supabaseAdmin
      .from('gameforge_sprint_members')
      .select('sprint_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!sprintMembership) {
      return res.json(null);
    }

    const { data: sprint, error } = await supabaseAdmin
      .from('gameforge_sprints')
      .select(`
        id,
        project_id,
        sprint_number,
        title,
        description,
        phase,
        status,
        goal,
        gdd,
        start_date,
        end_date,
        deadline,
        planned_velocity,
        actual_velocity,
        created_at,
        gameforge_projects(id, name, lead_id)
      `)
      .eq('id', sprintMembership.sprint_id)
      .single();

    if (error) throw error;
    res.json(sprint);
  } catch (err: any) {
    console.error('[GameForge Sprint]', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/gameforge/sprints
 * List sprints for a project
 */
router.get('/sprints', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const projectId = req.query.projectId as string;
    const status = req.query.status as string;

    let dbQuery = supabaseAdmin
      .from('gameforge_sprints')
      .select(`
        id,
        project_id,
        sprint_number,
        title,
        description,
        phase,
        status,
        goal,
        start_date,
        end_date,
        planned_velocity,
        actual_velocity,
        created_at,
        gameforge_projects(name),
        gameforge_sprint_members(user_id)
      `);

    if (projectId) {
      dbQuery = dbQuery.eq('project_id', projectId);
    }

    if (status) {
      dbQuery = dbQuery.eq('status', status);
    }

    const { data, error } = await dbQuery.order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err: any) {
    console.error('[GameForge Sprints]', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/gameforge/sprints
 * Create a new sprint (requires project lead)
 */
router.post('/sprints', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { projectId, title, description, goal, startDate, endDate, plannedVelocity, gdd } = req.body;

    const { data: project } = await supabaseAdmin
      .from('gameforge_projects')
      .select('id')
      .eq('id', projectId)
      .eq('lead_id', user.id)
      .single();

    if (!project) {
      return res.status(403).json({ error: 'Only project lead can create sprints' });
    }

    const { data: lastSprint } = await supabaseAdmin
      .from('gameforge_sprints')
      .select('sprint_number')
      .eq('project_id', projectId)
      .order('sprint_number', { ascending: false })
      .limit(1)
      .single();

    const nextSprintNumber = (lastSprint?.sprint_number || 0) + 1;

    const { data: sprint, error } = await supabaseAdmin
      .from('gameforge_sprints')
      .insert([{
        project_id: projectId,
        sprint_number: nextSprintNumber,
        title,
        description,
        goal,
        gdd,
        start_date: startDate,
        end_date: endDate,
        deadline: endDate,
        planned_velocity: plannedVelocity,
        created_by: user.id,
        phase: 'planning',
        status: 'pending',
      }])
      .select()
      .single();

    if (error) throw error;

    await supabaseAdmin
      .from('gameforge_sprint_members')
      .insert([{
        sprint_id: sprint.id,
        user_id: user.id,
        role: 'lead',
      }]);

    res.status(201).json(sprint);
  } catch (err: any) {
    console.error('[GameForge Sprints]', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/gameforge/sprints/:id/join
 * Join a sprint
 */
router.post('/sprints/:id/join', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;
    const { role = 'member' } = req.body;

    const { data: existing } = await supabaseAdmin
      .from('gameforge_sprint_members')
      .select('id')
      .eq('sprint_id', id)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'Already a member of this sprint' });
    }

    const { data, error } = await supabaseAdmin
      .from('gameforge_sprint_members')
      .insert([{
        sprint_id: id,
        user_id: user.id,
        role,
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err: any) {
    console.error('[GameForge Sprint Join]', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/gameforge/team
 * Get team members for user's current sprint
 */
router.get('/team', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { data: sprintMembership } = await supabaseAdmin
      .from('gameforge_sprint_members')
      .select('sprint_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!sprintMembership) {
      return res.json([]);
    }

    const { data: members, error } = await supabaseAdmin
      .from('gameforge_sprint_members')
      .select(`
        id,
        sprint_id,
        role,
        role_title,
        user_id,
        created_at,
        user_profiles(id, full_name, avatar_url, username)
      `)
      .eq('sprint_id', sprintMembership.sprint_id);

    if (error) throw error;

    const formattedMembers = (members || []).map((m: any) => ({
      id: m.user_profiles?.id || m.user_id,
      full_name: m.user_profiles?.full_name || 'Unknown',
      avatar_url: m.user_profiles?.avatar_url,
      username: m.user_profiles?.username,
      role: m.role,
      role_title: m.role_title,
      joined_at: m.created_at,
    }));

    res.json(formattedMembers);
  } catch (err: any) {
    console.error('[GameForge Team]', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/gameforge/tasks
 * Get tasks for user's current sprint
 */
router.get('/tasks', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const sprintId = req.query.sprintId as string;
    const projectId = req.query.projectId as string;
    const status = req.query.status as string;
    const assignedTo = req.query.assignedTo as string;

    let targetSprintId = sprintId;

    if (!targetSprintId && !projectId) {
      const { data: sprintMembership } = await supabaseAdmin
        .from('gameforge_sprint_members')
        .select('sprint_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (sprintMembership) {
        targetSprintId = sprintMembership.sprint_id;
      }
    }

    let dbQuery = supabaseAdmin
      .from('gameforge_tasks')
      .select(`
        id,
        sprint_id,
        project_id,
        title,
        description,
        status,
        priority,
        estimated_hours,
        actual_hours,
        assigned_to,
        created_by,
        due_date,
        completed_at,
        created_at,
        assigned_to_profile:user_profiles!assigned_to(id, full_name, avatar_url)
      `);

    if (targetSprintId) {
      dbQuery = dbQuery.eq('sprint_id', targetSprintId);
    } else if (projectId) {
      dbQuery = dbQuery.eq('project_id', projectId);
    }

    if (status) dbQuery = dbQuery.eq('status', status);
    if (assignedTo) dbQuery = dbQuery.eq('assigned_to', assignedTo);

    const { data, error } = await dbQuery.order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err: any) {
    console.error('[GameForge Tasks]', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/gameforge/tasks
 * Create a new task
 */
router.post('/tasks', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { sprintId, projectId, title, description, priority, estimatedHours, assignedTo, dueDate } = req.body;

    if (!projectId || !title) {
      return res.status(400).json({ error: 'Project ID and title are required' });
    }

    const { data: task, error } = await supabaseAdmin
      .from('gameforge_tasks')
      .insert([{
        sprint_id: sprintId || null,
        project_id: projectId,
        title,
        description,
        priority: priority || 'medium',
        estimated_hours: estimatedHours,
        assigned_to: assignedTo || null,
        created_by: user.id,
        due_date: dueDate || null,
        status: 'todo',
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(task);
  } catch (err: any) {
    console.error('[GameForge Tasks]', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/gameforge/tasks/:id
 * Update a task
 */
router.put('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;
    const { status, priority, estimatedHours, actualHours, assignedTo, title, description } = req.body;

    const { data: task } = await supabaseAdmin
      .from('gameforge_tasks')
      .select('project_id, assigned_to, created_by')
      .eq('id', id)
      .single();

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const { data: project } = await supabaseAdmin
      .from('gameforge_projects')
      .select('id')
      .eq('id', task.project_id)
      .eq('lead_id', user.id)
      .single();

    if (!project && task.assigned_to !== user.id && task.created_by !== user.id) {
      return res.status(403).json({ error: 'No permission to edit task' });
    }

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (estimatedHours !== undefined) updateData.estimated_hours = estimatedHours;
    if (actualHours !== undefined) updateData.actual_hours = actualHours;
    if (assignedTo !== undefined) updateData.assigned_to = assignedTo;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status === 'done') updateData.completed_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('gameforge_tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    console.error('[GameForge Tasks]', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/gameforge/metrics
 * Get metrics for a project or sprint (requires auth)
 */
router.get('/metrics', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const projectId = req.query.projectId as string;
    const sprintId = req.query.sprintId as string;

    let taskQuery = supabaseAdmin
      .from('gameforge_tasks')
      .select('status, estimated_hours, actual_hours', { count: 'exact' });

    if (sprintId) {
      taskQuery = taskQuery.eq('sprint_id', sprintId);
    } else if (projectId) {
      taskQuery = taskQuery.eq('project_id', projectId);
    } else {
      return res.status(400).json({ error: 'projectId or sprintId required' });
    }

    const { data: tasks, count } = await taskQuery;

    const metrics = {
      totalTasks: count || 0,
      todoCount: tasks?.filter((t: any) => t.status === 'todo').length || 0,
      inProgressCount: tasks?.filter((t: any) => t.status === 'in_progress').length || 0,
      doneCount: tasks?.filter((t: any) => t.status === 'done').length || 0,
      totalEstimatedHours: tasks?.reduce((sum: number, t: any) => sum + (t.estimated_hours || 0), 0) || 0,
      totalActualHours: tasks?.reduce((sum: number, t: any) => sum + (t.actual_hours || 0), 0) || 0,
    };

    res.json(metrics);
  } catch (err: any) {
    console.error('[GameForge Metrics]', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
