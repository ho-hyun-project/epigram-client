import { PostEpigramData } from '../../types/epigrams';
import instance from './axios';

export async function getEpigrams(limit = 5, cursor = 0, keyword = '') {
  let epigrams;
  try {
    const res = await instance.get(
      `/epigrams?limit=${limit}&cursor=${cursor}&keyword=${keyword}`
    );
    epigrams = res.data;
  } catch (error) {
    throw new Error('에피그램 목록을 불러오는데 실패했습니다.');
  }
  return epigrams;
}

export async function postEpigram(data: PostEpigramData) {
  try {
    const response = await instance.post(`/epigrams`, data);
    return response.data;
  } catch (error) {
    throw new Error('에피그램을 생성하는데 실패했습니다.');
  }
}

export async function getTodayEpigram() {
  try {
    const response = await instance.get(`/epigrams/today`);
    return response.data;
  } catch (error) {
    throw new Error('오늘의 에피그램을 불러오는데 실패했습니다.');
  }
}

export async function getEpigramById(id: number) {
  try {
    const response = await instance.get(`/epigrams/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`${id}번 에피그램을 불러오는데 실패했습니다.`);
  }
}

export async function updateEpigram(id: number, data: PostEpigramData) {
  try {
    const response = await instance.patch(`/epigrams/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(`${id}번 에피그램을 수정하는데 실패했습니다.`);
  }
}

export async function deleteEpigram(id: number) {
  try {
    const response = await instance.delete(`/epigrams/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`${id}번 에피그램을 삭제하는데 실패했습니다.`);
  }
}

export async function getMyEpigrams(id: number, limit: number, cursor: number) {
  let comments;
  try {
    const res = await instance.get(`/epigrams`, {
      params: {
        limit,
        cursor,
        writerId: id,
      },
    });
    comments = await res.data;
  } catch (error) {
    console.error('내 에피그램 목록을 불러오는데 실패했습니다.');
  }
  return comments;
}

export async function getRecentEpigrams(limit: number, cursor: number) {
  let comments;
  try {
    const res = await instance.get('/epigrams', {
      params: {
        limit,
        cursor,
      },
    });
    comments = await res.data;
  } catch (error) {
    console.error('최신 에피그램을 불러오는데 실패했습니다.');
  }
  return comments;
}
export async function likeEpigram(epigramId: number) {
  try {
    const response = await instance.post(`/epigrams/${epigramId}/like`);
    return response.data;
  } catch (error) {
    throw new Error(
      `${epigramId}번 에피그램에 좋아요를 추가하는데 실패했습니다.`
    );
  }
}

export async function unlikeEpigram(epigramId: number) {
  try {
    const response = await instance.delete(`/epigrams/${epigramId}/like`);
    return response.data;
  } catch (error) {
    throw new Error(
      `${epigramId}번 에피그램에 좋아요를 취소하는데 실패했습니다.`
    );
  }
}
