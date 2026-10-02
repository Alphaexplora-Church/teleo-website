// src/features/discipleship/models/discipleshipProgramIntro.mock.ts
import { mockDiscipleshipChurches } from './discipleshipChurches.mocks';

export type ProgramMeetingFormat =
    | 'Hybrid (In-Person & Online)'
    | 'In-Person Only'
    | 'Virtual / Online Only';

export interface DiscipleshipProgramDetail {
    church_id: number;
    church_name: string;
    city: string;
    is_home_church: boolean;
    active_groups_count: number;
    format: ProgramMeetingFormat;
    description: string;
    review_timing_days: string;
}

export const mockDiscipleshipProgramDetails: Record<
    number,
    Pick<DiscipleshipProgramDetail, 'format' | 'description' | 'review_timing_days'>
> = {
    // 101 - Grace Community Church (Home Church)
    101: {
        format: 'In-Person Only',
        description:
            'Our discipleship circles meet weekly to study scripture, pray together, and spur one another on toward Christlikeness. We emphasize intentional relationships and local community building.',
        review_timing_days: '2–3 days',
    },

    // 102 - Riverside Fellowship
    102: {
        format: 'Hybrid (In-Person & Online)',
        description:
            'Our discipleship groups meet weekly in homes and online to study scripture, pray together, and spur one another on toward Christlikeness. We emphasize intentional relationships and spiritual mentorship.',
        review_timing_days: '3–5 days',
    },

    // 105 - Victory Christian Fellowship
    105: {
        format: 'Hybrid (In-Person & Online)',
        description:
            'We believe spiritual growth happens best in community. Our Victory groups gather weekly across Taguig to share life, study the Word of God, and equip every believer for discipleship.',
        review_timing_days: '3–5 days',
    },

    // 106 - Christ Commission Fellowship
    106: {
        format: 'Hybrid (In-Person & Online)',
        description:
            'Our D-Groups (Discipleship Groups) focus on making Christ-committed followers who will make Christ-committed followers. Join a loving family centered on scripture and spiritual accountability.',
        review_timing_days: '3–5 days',
    },

    // 107 - Faith Community Bible Church
    107: {
        format: 'In-Person Only',
        description:
            'A biblically grounded community focused on expository teaching and intimate small group fellowship. Groups meet in local homes across Muntinlupa.',
        review_timing_days: '2–4 days',
    },

    // 108 - Metro South Bible Fellowship
    108: {
        format: 'In-Person Only',
        description:
            'Connecting believers in Parañaque through intentional biblical accountability and spiritual multiplication. We foster lifelong brotherhood and sisterhood in Christ.',
        review_timing_days: '2–4 days',
    },

    // 109 - Cornerstone Christian Church
    109: {
        format: 'Virtual / Online Only',
        description:
            'Designed for busy professionals and remote community members. Connect through interactive online video small groups to grow together in discipleship.',
        review_timing_days: '1–2 days',
    },
};

/**
 * Kinukuha ang kumpletong detalye ng Discipleship program
 * gamit ang church_id na pinindot ng user sa mock list.
 */
export function getDiscipleshipProgramByChurchId(churchId: number): DiscipleshipProgramDetail | null {
    const church = mockDiscipleshipChurches.find((c) => c.church_id === churchId);
    if (!church) return null;

    const extraDetails = mockDiscipleshipProgramDetails[churchId] || mockDiscipleshipProgramDetails[102];

    return {
        church_id: church.church_id,
        church_name: church.name,
        city: church.city,
        is_home_church: church.is_home_church,
        active_groups_count: church.active_groups_count,
        ...extraDetails,
    };
}