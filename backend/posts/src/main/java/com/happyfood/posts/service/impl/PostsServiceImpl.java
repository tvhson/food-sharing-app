package com.happyfood.posts.service.impl;

import com.happyfood.posts.dto.Coordinates;
import com.happyfood.posts.dto.NumberPostsReceivedDto;
import com.happyfood.posts.dto.PostsDto;
import com.happyfood.posts.entity.Images;
import com.happyfood.posts.entity.Posts;
import com.happyfood.posts.exception.CustomException;
import com.happyfood.posts.mapper.PostsMapper;
import com.happyfood.posts.repository.PostsRepository;
import com.happyfood.posts.service.IPostsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostsServiceImpl implements IPostsService {
    private static final double EARTH_RADIUS_KM = 6371.0;
    private final PostsRepository postsRepository;

    @Override
    public PostsDto createPost(Long userId, PostsDto postsDto) {
        Posts posts = PostsMapper.mapToPosts(postsDto);
        posts.setUserIdReceived("");
        posts.setDeleted(false);
        posts.setCreatedById(userId);
        posts.setCreatedDate(new Date());
        if (postsDto.getTags() != null && !postsDto.getTags().isEmpty()) {
            posts.setTags(String.join("-", postsDto.getTags()));
        }

        posts.setImages(new ArrayList<>());
        for (String imageUrl : postsDto.getImages()) {
            posts.getImages().add(Images.builder().url(imageUrl).post(posts).build());
        }

        return convertToResponse(postsRepository.save(posts), userId);
    }

    @Override
    public PostsDto updatePostById(Long userId, PostsDto postsDto, Long postId) {
        Posts posts = postsRepository.findById(postId).orElseThrow(() -> new CustomException("Không tìm thấy bài viết", HttpStatus.NOT_FOUND));
        if (!Objects.equals(posts.getCreatedById(), userId)) {
            throw new CustomException("Bạn không có quyền chỉnh sửa bài viết này", HttpStatus.FORBIDDEN);
        }
        posts.setTitle(postsDto.getTitle());
        posts.setContent(postsDto.getContent());
        posts.setWeight(postsDto.getWeight());
        posts.setDescription(postsDto.getDescription());
        posts.setNote(postsDto.getNote());
        posts.setExpiredDate(postsDto.getExpiredDate());
        posts.setPickUpStartDate(postsDto.getPickUpStartDate());
        posts.setPickUpEndDate(postsDto.getPickUpEndDate());
        posts.setStatus(postsDto.getStatus());
        posts.setLocationName(postsDto.getLocationName());
        posts.setLatitude(postsDto.getLatitude());
        posts.setLongitude(postsDto.getLongitude());
        posts.setReceiverId(postsDto.getReceiverId());
        posts.setPortion(postsDto.getPortion());
        posts.setType(postsDto.getType());
        if (postsDto.getTags() != null && !postsDto.getTags().isEmpty()) {
            posts.setTags(String.join("-", postsDto.getTags()));
        }

        posts.getImages().clear();
        for (String imageUrl : postsDto.getImages()) {
            posts.getImages().add(Images.builder().url(imageUrl).post(posts).build());
        }

        return convertToResponse(postsRepository.save(posts), userId);
    }

    @Override
    public void deletePostById(Long userId, Long postId) {
        Posts posts = postsRepository.findById(postId).orElseThrow(() -> new CustomException("Không tìm thấy bài viết", HttpStatus.NOT_FOUND));
        if (!Objects.equals(posts.getCreatedById(), userId)) {
            throw new CustomException("Bạn không có quyền chỉnh sửa bài viết này", HttpStatus.FORBIDDEN);
        }
        posts.setDeleted(true);
        postsRepository.save(posts);
    }

    @Override
    public PostsDto getPostById(Long userId, Long postId) {
        return convertToResponse(postsRepository.findById(postId).orElseThrow(() -> new CustomException("Không tìm thấy bài viết", HttpStatus.NOT_FOUND)), userId);
    }

    @Override
    public List<PostsDto> getRecommendedPosts(Long userId, String type, String latitude, String longitude, Long distance) {
        List<Posts> posts = postsRepository.findAll();

        LocalDate localDate = LocalDate.now();
        Date date = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());

        for (Posts post : posts) {
            if (post.getExpiredDate() != null && post.getExpiredDate().before(date)) {
                post.setStatus("NOT_AVAILABLE");
                postsRepository.save(post);
            } else if (post.getPickUpEndDate() != null && post.getPickUpEndDate().before(date)) {
                post.setStatus("NOT_AVAILABLE");
                postsRepository.save(post);
            }
        }


        List<PostsDto> recommendedPosts = posts.stream()
                                               .filter(post -> type == null || type.equals("ALL") || (post.getType() != null && post.getType().equals(type)))
                                               .filter(post -> !post.isDeleted())
                                               .filter(post -> !post.getStatus().equals("NOT_AVAILABLE"))
                                               .map(post -> convertToResponse(post, userId))
                                               .filter(postsDto -> !postsDto.getIsReceived()).collect(Collectors.toList());

        if (distance != null) {
            double lat = Double.parseDouble(latitude);
            double longt = Double.parseDouble(longitude);
            recommendedPosts = recommendedPosts.stream()
                                               .filter(postsDto -> {
                                                   double postLatitude = Double.parseDouble(postsDto.getLatitude());
                                                   double postLongitude = Double.parseDouble(postsDto.getLongitude());
                                                   double distanceBetween = calculateDistanceKm(lat, longt, postLatitude, postLongitude);
                                                   postsDto.setDistance(distanceBetween);
                                                   return distanceBetween < distance;
                                               })
                                               .collect(Collectors.toList());
        }

        Collections.reverse(recommendedPosts);
        return recommendedPosts;
    }

    @Override
    public List<PostsDto> getPostsOfUser(Long userId) {
        List<Posts> posts = postsRepository.findAllByCreatedById(userId);
        Collections.reverse(posts);
        return posts.stream()
                    .filter(post -> !post.isDeleted())
                    .map(post -> convertToResponse(post, userId))
                    .toList();
    }

    @Override
    public void toggleLikePost(Long userId, Long postId) {
        Posts posts = postsRepository.findById(postId).orElseThrow(() -> new CustomException("Không tìm thấy bài viết", HttpStatus.NOT_FOUND));

        if (posts.getUserIdLikes() == null || posts.getUserIdLikes().isEmpty()) {
            posts.setUserIdLikes(userId.toString());
        } else {
            String[] userIdLikes = posts.getUserIdLikes().split("-");
            if (Arrays.stream(userIdLikes).anyMatch(s -> s.equals(userId.toString()))) {
                posts.setUserIdLikes(Arrays.stream(userIdLikes).filter(s -> !s.equals(userId.toString())).collect(Collectors.joining("-")));
            } else {
                posts.setUserIdLikes(posts.getUserIdLikes() + "-" + userId);
            }
        }
        postsRepository.save(posts);
    }

    @Override
    public void confirmReceivedPost(Long userId, Long postId) {
        Posts posts = postsRepository.findById(postId).orElseThrow(() -> new CustomException("Không tìm thấy bài viết", HttpStatus.NOT_FOUND));

        posts.setPortion(posts.getPortion() - 1);
        if (posts.getPortion() == 0) {
            posts.setStatus("NOT_AVAILABLE");
        }
        if (posts.getPortion() < 0) {
            throw new CustomException("Thực phẩm này đã được nhận hết", HttpStatus.BAD_REQUEST);
        }

        if (posts.getUserIdReceived() == null || posts.getUserIdReceived().isEmpty()) {
            posts.setUserIdReceived(userId.toString());
        } else {
            posts.setUserIdReceived(posts.getUserIdReceived() + "-" + userId);
        }
        postsRepository.save(posts);
    }

    @Override
    public NumberPostsReceivedDto getNumberPostsReceived(Long userId) {
        List<Posts> posts = postsRepository.findAll();
        long numberPostsReceived = posts.stream()
                                        .filter(post -> post.getUserIdReceived() != null && !post.getUserIdReceived().isEmpty())
                                        .filter(post -> Arrays.stream(post.getUserIdReceived().split("-")).anyMatch(s -> s.equals(userId.toString())))
                                        .count();
        return NumberPostsReceivedDto.builder().numberPostsReceived(numberPostsReceived).build();
    }

    private PostsDto convertToResponse(Posts posts, Long userId) {
        PostsDto postsDto = PostsMapper.mapToPostsDto(posts);
        if (posts.getUserIdLikes() != null && !posts.getUserIdLikes().isEmpty()) {
            postsDto.setIsLiked(Arrays.stream(posts.getUserIdLikes().split("-")).anyMatch(s -> s.equals(userId.toString())));
        }
        if (posts.getUserIdReceived() != null && !posts.getUserIdReceived().isEmpty()) {
            postsDto.setIsReceived(Arrays.stream(posts.getUserIdReceived().split("-")).anyMatch(s -> s.equals(userId.toString())));
        }
        return postsDto;
    }

    public double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                   + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                     * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_KM * c;
    }
}