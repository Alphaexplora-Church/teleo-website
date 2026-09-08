import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  deletePrayer,
  getCurrentUserId,
  getPrayerCardById,
  getPrayerComments,
  markPrayerAsAnswered,
  togglePrayerReaction,
  updatePrayer,
} from '../models/prayerApi';
import type { PrayerComment } from '../models/commentTypes';
import type { PrayerAudience, PrayerCard, PrayerReactionType } from '../models/prayerTypes';
import type { DashboardTab } from '../../../shared/models/navigationTypes';

export const usePrayerDetailsViewModel = () => {
  const navigate = useNavigate();
  const { prayerId = '' } = useParams<{ prayerId: string }>();
  const [prayer, setPrayer] = useState<PrayerCard | null>(null);
  const [comments, setComments] = useState<PrayerComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reactingAction, setReactingAction] = useState<PrayerReactionType | null>(null);
  const [isPostMenuOpen, setIsPostMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrayerTag, setEditPrayerTag] = useState('');
  const [editAudience, setEditAudience] = useState<PrayerAudience>('PUBLIC');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMarkingAnswered, setIsMarkingAnswered] = useState(false);
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [answerTestimony, setAnswerTestimony] = useState('');
  const [hasHeartReacted, setHasHeartReacted] = useState(false);

  useEffect(() => {
    void (async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const mappedPrayer = await getPrayerCardById(prayerId);
        setPrayer(mappedPrayer);
        setComments(getPrayerComments(prayerId, mappedPrayer.comments));
        setEditTitle(mappedPrayer.title);
        setEditDescription(mappedPrayer.description);
        setEditPrayerTag(mappedPrayer.prayerTag ?? '');
        setEditAudience(mappedPrayer.audience);
      } catch (error) {
        setPrayer(null);
        setComments([]);
        setErrorMessage(
          error instanceof Error ? error.message : 'Unable to load this prayer request.',
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [prayerId]);

  const reactToPost = async (reactionType: PrayerReactionType = 'AMEN') => {
    if (!prayer || reactingAction || prayer.isAnswered) {
      return;
    }

    setReactingAction(reactionType);
    setErrorMessage(null);

    try {
      await togglePrayerReaction(prayer.id, reactionType);
      setHasHeartReacted((current) => !current);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to react to this prayer request.',
      );
    } finally {
      setReactingAction(null);
    }
  };

  const savePrayerEdit = async () => {
    const title = editTitle.trim();
    const description = editDescription.trim();

    if (!prayer || !title || !description || isSavingEdit) {
      setErrorMessage('Please complete the subject and prayer request.');
      return;
    }

    setIsSavingEdit(true);
    setErrorMessage(null);

    try {
      const updatedPrayer = await updatePrayer(prayer.id, {
        title,
        description,
        audience: editAudience,
        prayer_tag: editPrayerTag.trim() || undefined,
      });

      setPrayer(updatedPrayer);
      setComments(getPrayerComments(updatedPrayer.id, updatedPrayer.comments));
      setIsEditing(false);
      setIsPostMenuOpen(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to update this prayer request.',
      );
    } finally {
      setIsSavingEdit(false);
    }
  };

  const deleteCurrentPrayer = async () => {
    if (!prayer || isDeleting) {
      return;
    }

    const confirmed = window.confirm('Delete this prayer request?');

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setIsPostMenuOpen(false);
    setErrorMessage(null);

    try {
      await deletePrayer(prayer.id);
      navigate('/dashboard', {
        state: { activeTab: 'prayer-wall', prayerWallRefresh: Date.now() },
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to delete this prayer request.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const openAnswerModal = () => {
    setIsPostMenuOpen(false);
    setAnswerTestimony('');
    setIsAnswerModalOpen(true);
  };

  const closeAnswerModal = () => {
    setIsAnswerModalOpen(false);
    setAnswerTestimony('');
  };

  const submitPraiseReport = async () => {
    if (!prayer || prayer.isAnswered || isMarkingAnswered || !answerTestimony.trim()) {
      return;
    }

    setIsMarkingAnswered(true);
    setErrorMessage(null);

    try {
      const updatedPrayer = await markPrayerAsAnswered(prayer.id, answerTestimony.trim());
      setPrayer(updatedPrayer);
      setComments(getPrayerComments(updatedPrayer.id, updatedPrayer.comments));
      setIsAnswerModalOpen(false);
      setAnswerTestimony('');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to submit praise report.',
      );
    } finally {
      setIsMarkingAnswered(false);
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    setIsPostMenuOpen(false);
  };

  return {
    prayer,
    comments,
    isOwner: prayer ? prayer.ownerId === getCurrentUserId() : false,
    isLoading,
    errorMessage,
    reactingAction,
    isPostMenuOpen,
    setIsPostMenuOpen,
    isEditing,
    setIsEditing,
    editTitle,
    setEditTitle,
    editDescription,
    setEditDescription,
    editPrayerTag,
    setEditPrayerTag,
    editAudience,
    setEditAudience,
    isSavingEdit,
    isDeleting,
    isMarkingAnswered,
    isAnswerModalOpen,
    answerTestimony,
    setAnswerTestimony,
    hasHeartReacted,
    reactToPost,
    startEditing,
    openAnswerModal,
    closeAnswerModal,
    submitPraiseReport,
    savePrayerEdit,
    deleteCurrentPrayer,
    goBack: () => navigate(-1),
    navigateToTab: (tab: DashboardTab) =>
      navigate('/dashboard', { state: { activeTab: tab } }),
  };
};
