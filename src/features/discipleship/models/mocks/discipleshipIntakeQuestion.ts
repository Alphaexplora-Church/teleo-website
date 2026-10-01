export type IntakeQuestionFieldType = "textarea" | "text";

export interface DiscipleshipIntakeQuestion {
  id: string;
  label: string;
  placeholder: string;
  field_type: IntakeQuestionFieldType;
  required: boolean;
  min_length?: number;
  max_length: number;
}

export interface ChurchIntakeFormTemplate {
  church_id: number;
  questions: DiscipleshipIntakeQuestion[];
}

export const mockDiscipleshipIntakeQuestions: Record<
  number,
  ChurchIntakeFormTemplate
> = {
  // 101 - Grace Community Church (3 Questions - Katulad ng nasa mockup)
  101: {
    church_id: 101,
    questions: [
      {
        id: "q1",
        label: "Where are you in your walk with God?",
        placeholder: "A few honest sentences is plenty.",
        field_type: "textarea",
        required: true,
        max_length: 500,
      },
      {
        id: "q2",
        label: "What are you hoping to find in a group?",
        placeholder: "Community, accountability, study...",
        field_type: "textarea",
        required: true,
        max_length: 500,
      },
      {
        id: "q3",
        label: "Preferred meeting time / schedule",
        placeholder: "Weekday evenings work best",
        field_type: "text",
        required: true,
        max_length: 100,
      },
    ],
  },

  // 102 - Riverside Fellowship (2 Questions - Simpleng form)
  102: {
    church_id: 102,
    questions: [
      {
        id: "q1",
        label: "Where are you in your walk with God?",
        placeholder: "Share where you currently stand in your faith.",
        field_type: "textarea",
        required: true,
        max_length: 500,
      },
      {
        id: "q2",
        label: "What are you hoping to find in a group?",
        placeholder:
          "e.g., Biblical guidance, life transitions, prayer support",
        field_type: "textarea",
        required: true,
        max_length: 500,
      },
      {
        id: "q3",
        label: "Preferred meeting time / schedule",
        placeholder: "e.g., Weekday evenings (Wed/Thu after 6:30 PM)",
        field_type: "text",
        required: true,
        max_length: 100,
      },
    ],
  },

  // 105 - Victory Christian Fellowship (4 Questions)
  105: {
    church_id: 105,
    questions: [
      {
        id: "q1",
        label: "How long have you been attending Victory?",
        placeholder: "e.g., Just visited, 6 months, 2 years",
        field_type: "text",
        required: true,
        max_length: 100,
      },
      {
        id: "q2",
        label: "Have you completed the ONE 2 ONE foundations booklet?",
        placeholder: "Yes / No / In Progress",
        field_type: "text",
        required: true,
        max_length: 100,
      },
      {
        id: "q3",
        label: "What are your primary goals for joining a Victory group?",
        placeholder: "Share your expectations for spiritual growth.",
        field_type: "textarea",
        required: true,
        max_length: 500,
      },
      {
        id: "q4",
        label: "Preferred meeting setup",
        placeholder: "e.g., Saturday mornings, Online via Zoom",
        field_type: "text",
        required: true,
        max_length: 100,
      },
    ],
  },

  // 106 - Christ Commission Fellowship (Max 5 Questions)
  106: {
    church_id: 106,
    questions: [
      {
        id: "q1",
        label:
          "Where are you currently in your personal walk with Jesus Christ?",
        placeholder: "Briefly share where you are spiritually right now.",
        field_type: "textarea",
        required: true,
        max_length: 500,
      },
      {
        id: "q2",
        label:
          "Have you received Jesus Christ as your personal Lord and Savior?",
        placeholder: "Yes, No, or Still seeking answers",
        field_type: "text",
        required: true,
        max_length: 100,
      },
      {
        id: "q3",
        label: "What life stage group fits you best?",
        placeholder: "e.g., Youth, Single Professional, Married, Couple",
        field_type: "text",
        required: true,
        max_length: 100,
      },
      {
        id: "q4",
        label: "What areas in life do you want prayer and accountability for?",
        placeholder: "Share what you are comfortable with leadership knowing.",
        field_type: "textarea",
        required: true,
        max_length: 500,
      },
      {
        id: "q5",
        label: "Preferred day and time for weekly D-Group",
        placeholder: "e.g., Friday nights or Sunday afternoons",
        field_type: "text",
        required: true,
        max_length: 100,
      },
    ],
  },

  // 107 - Faith Community Bible Church (2 Questions)
  107: {
    church_id: 107,
    questions: [
      {
        id: "q1",
        label: "How did you hear about Faith Community Bible Church?",
        placeholder: "Attended a service, friend invite, social media...",
        field_type: "text",
        required: true,
        max_length: 100,
      },
      {
        id: "q2",
        label: "What are you hoping to learn or study together?",
        placeholder:
          "e.g., Book of Romans, Christian family life, theology basics",
        field_type: "textarea",
        required: true,
        max_length: 500,
      },
    ],
  },

  // 108 - Metro South Bible Fellowship (3 Questions)
  108: {
    church_id: 108,
    questions: [
      {
        id: "q1",
        label: "Briefly share how you came to know Christ.",
        placeholder: "A few honest sentences about your testimony.",
        field_type: "textarea",
        required: true,
        max_length: 500,
      },
      {
        id: "q2",
        label: "Are you currently involved in any other church or small group?",
        placeholder: "Yes / No (specify church if applicable)",
        field_type: "text",
        required: true,
        max_length: 100,
      },
      {
        id: "q3",
        label: "What area of Parañaque are you located in?",
        placeholder: "e.g., BF Homes, Sucat, Moonwalk",
        field_type: "text",
        required: true,
        max_length: 100,
      },
    ],
  },

  // 109 - Cornerstone Christian Church (1 Question - Pinakamaikli)
  109: {
    church_id: 109,
    questions: [
      {
        id: "q1",
        label:
          "Tell us about yourself and what you are looking for in an online group.",
        placeholder:
          "Share your background, faith journey, and preferred online meeting hours.",
        field_type: "textarea",
        required: true,
        max_length: 500,
      },
    ],
  },
};

/**
 * Kinukuha ang intake form template batay sa church_id na pinili.
 */
export function getIntakeQuestionsByChurchId(
  churchId: number,
): ChurchIntakeFormTemplate {
  return (
    mockDiscipleshipIntakeQuestions[churchId] ||
    mockDiscipleshipIntakeQuestions[101]
  );
}
